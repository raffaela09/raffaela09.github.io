import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBpCgZ-jArpS13cQFIWZbnVhylcGSXb608",
    authDomain: "topo-engenharia.firebaseapp.com",
    projectId: "topo-engenharia",
    storageBucket: "topo-engenharia.firebasestorage.app",
    messagingSenderId: "565718749371",
    appId: "1:565718749371:web:f47ca2c53cbca90850199e",
    measurementId: "G-THQKJZ148S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 

const IMGBB_API_KEY = "e7dd42b3688bf7785b4f4dee629ef0b8"; 

const form = document.getElementById('form-imovel');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('foto-upload');
const submitBtn = form.querySelector('button[type="submit"]');
const listaImoveisContainer = document.getElementById('lista-imoveis');
const btnSair = document.getElementById('btn-sair');

let arquivoSelecionado = null; 
let idEdicao = null; 

// ==========================================
// 0. BARRANDO INTRUSOS
// ==========================================
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace("login.html");
    } else {
        document.body.style.display = "block"; 
    }
});

// ==========================================
// 1. LOGOUT
// ==========================================
if (btnSair) {
    btnSair.addEventListener('click', () => {
        Swal.fire({
            title: 'Deseja realmente sair?',
            text: "Sua sessão segura será encerrada.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#2a2a2d',
            confirmButtonText: 'Sim, sair!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await signOut(auth); 
                    window.location.replace("login.html"); 
                } catch (error) {
                    Swal.fire('Erro!', 'Deu um probleminha ao tentar sair.', 'error');
                }
            }
        });
    });
}

// ==========================================
// NOVA FUNÇÃO: ESCONDER QUARTOS PARA TERRENO
// ==========================================
function atualizarVisibilidadeCampos() {
    const tipo = document.getElementById('tipoImovel').value;
    
    // Pega as "caixas" inteiras (label + input)
    const boxQuartos = document.getElementById('quartos').parentElement;
    const boxBanheiros = document.getElementById('banheiros').parentElement;
    const boxVagas = document.getElementById('vagas').parentElement;

    if (tipo === 'terreno') {
        boxQuartos.style.display = 'none';
        boxBanheiros.style.display = 'none';
        boxVagas.style.display = 'none';
        
        // Zera os valores pra não ir sujeira pro banco de dados
        document.getElementById('quartos').value = '';
        document.getElementById('banheiros').value = '';
        document.getElementById('vagas').value = '';
    } else {
        boxQuartos.style.display = 'block';
        boxBanheiros.style.display = 'block';
        boxVagas.style.display = 'block';
    }
}

// Ouve toda vez que você mudar a caixinha de Tipo
document.getElementById('tipoImovel').addEventListener('change', atualizarVisibilidadeCampos);

// ==========================================
// 2. LISTAGEM E EVENTOS
// ==========================================
function carregarListaAdmin() {
    const q = query(collection(db, "imoveis"), orderBy("dataCriacao", "desc"));
    onSnapshot(q, (snapshot) => {
        listaImoveisContainer.innerHTML = "";
        snapshot.forEach((documento) => {
            const imovel = documento.data();
            const id = documento.id;
            
            const statusLabel = imovel.modalidade === 'locacao' ? 'Locação' : 'Venda';
            
            // Inteligência para não mostrar 0 quartos se for terreno
            let detalhesTexto = "";
            if (imovel.tipoImovel === 'terreno') {
                detalhesTexto = `Área: ${imovel.area}m²`;
            } else {
                detalhesTexto = `${imovel.quartos} qts • ${imovel.banheiros} banh • ${imovel.area}m²`;
            }

            const cardHTML = `
                <div class="imovel-item">
                    <img src="${imovel.imagemUrl}" alt="${imovel.titulo}">
                    <div class="imovel-info">
                        <h5>${imovel.titulo} <span style="font-size: 10px; background: var(--primary-color); padding: 2px 6px; border-radius: 4px; margin-left: 5px;">${statusLabel}</span></h5>
                        <p class="imovel-detalhes">${detalhesTexto}</p>
                        <p class="imovel-preco">R$ ${Number(imovel.preco).toLocaleString('pt-BR')}</p>
                    </div>
                    <div class="imovel-actions">
                        <button class="btn-outline btn-editar" data-id="${id}">Editar</button>
                        <button class="btn-danger btn-excluir" data-id="${id}">Excluir</button>
                    </div>
                </div>
            `;
            listaImoveisContainer.innerHTML += cardHTML;
        });
        vincularEventosBotoes();
    });
}

function vincularEventosBotoes() {
    document.querySelectorAll('.btn-excluir').forEach(botao => {
        botao.onclick = (e) => {
            const id = e.target.getAttribute('data-id');
            Swal.fire({
                title: 'Tem certeza?',
                text: "Você não poderá recuperar esse imóvel!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#2a2a2d',
                confirmButtonText: 'Sim, excluir!',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await deleteDoc(doc(db, "imoveis", id));
                    Swal.fire('Excluído!', 'O imóvel evaporou.', 'success');
                }
            });
        };
    });

    document.querySelectorAll('.btn-editar').forEach(botao => {
        botao.onclick = async (e) => {
            idEdicao = e.target.getAttribute('data-id');
            const docSnap = await getDoc(doc(db, "imoveis", idEdicao));

            if (docSnap.exists()) {
                const dados = docSnap.data();
                
                document.getElementById('titulo').value = dados.titulo;
                document.getElementById('tipoImovel').value = dados.tipoImovel || 'casa';
                document.getElementById('modalidade').value = dados.modalidade || 'venda';
                document.getElementById('cidade').value = dados.cidade || 'tres-lagoas';
                document.getElementById('quartos').value = dados.quartos || '';
                document.getElementById('banheiros').value = dados.banheiros || '';
                document.getElementById('descricao').value = dados.descricao;
                document.getElementById('vagas').value = dados.vagas || '';
                document.getElementById('area').value = dados.area;
                document.getElementById('preco').value = dados.preco;
                
                // MÁGICA: Ao clicar em editar, avisa a função para esconder os campos se a casa que veio do banco for terreno!
                atualizarVisibilidadeCampos();
                
                submitBtn.textContent = "Atualizar Imóvel";
                submitBtn.style.backgroundColor = "#296b48";
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
                dropZone.querySelector('p').textContent = "Foto já cadastrada (clique se quiser trocar)";
            }
        };
    });
}

carregarListaAdmin();

// ==========================================
// 3. SALVAR OU ATUALIZAR
// ==========================================
function atualizarTextoDropZone(arquivo) {
    arquivoSelecionado = arquivo; 
    dropZone.querySelector('p').textContent = `Nova foto: ${arquivo.name}`;
}

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) atualizarTextoDropZone(e.target.files[0]);
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Processando...";

    try {
        let urlFinal = null;

        if (arquivoSelecionado) {
            const formData = new FormData();
            formData.append("image", arquivoSelecionado);
            const resImg = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
            const dadosImg = await resImg.json();
            urlFinal = dadosImg.data.display_url;
        }

        const dadosImovel = {
            titulo: document.getElementById('titulo').value,
            tipoImovel: document.getElementById('tipoImovel').value,
            modalidade: document.getElementById('modalidade').value,
            cidade: document.getElementById('cidade').value,
            quartos: Number(document.getElementById('quartos').value) || 0,
            banheiros: Number(document.getElementById('banheiros').value) || 0,
            descricao: document.getElementById('descricao').value,
            vagas: Number(document.getElementById('vagas').value) || 0,
            area: Number(document.getElementById('area').value),
            preco: Number(document.getElementById('preco').value)
        };

        if (urlFinal) dadosImovel.imagemUrl = urlFinal;

        if (idEdicao) {
            await updateDoc(doc(db, "imoveis", idEdicao), dadosImovel);
            Swal.fire('Atualizado!', 'Informações salvas com sucesso.', 'success');
            idEdicao = null;
        } else {
            if (!arquivoSelecionado) throw new Error("Selecione uma foto para o novo imóvel!");
            dadosImovel.dataCriacao = new Date();
            dadosImovel.imagemUrl = urlFinal;
            await addDoc(collection(db, "imoveis"), dadosImovel);
            Swal.fire('Sucesso!', 'Imóvel cadastrado com sucesso!', 'success');
        }

        form.reset();
        atualizarVisibilidadeCampos(); // Reseta as caixinhas pra voltarem ao normal depois de salvar!
        submitBtn.textContent = "Cadastrar Imóvel";
        submitBtn.style.backgroundColor = ""; 
        arquivoSelecionado = null;
        dropZone.querySelector('p').textContent = "Arraste uma foto aqui ou clique para fazer upload";

    } catch (error) {
        Swal.fire('Erro!', error.message, 'error');
    } finally {
        submitBtn.disabled = false;
    }
});