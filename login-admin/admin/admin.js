import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
// IMPORTANDO O AUTH E O SIGNOUT PARA LOGOUT
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
const btnSair = document.getElementById('btn-sair'); // Puxando o botão de sair

let arquivoSelecionado = null; 
let idEdicao = null; 

// ==========================================
// 0. BARRANDO INTRUSOS E MOSTRANDO TELA
// ==========================================
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace("login.html");
    } else {
        document.body.style.display = "block"; // Tira a capa de invisibilidade
    }
});

// ==========================================
// 1. LOGOUT (BOTÃO DE SAIR)
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
                    console.error("Erro ao fazer logout:", error);
                    Swal.fire('Erro!', 'Deu um probleminha ao tentar sair.', 'error');
                }
            }
        });
    });
}

// ==========================================
// 2. LISTAGEM E EVENTOS (EXCLUIR/EDITAR)
// ==========================================
function carregarListaAdmin() {
    const q = query(collection(db, "imoveis"), orderBy("dataCriacao", "desc"));
    onSnapshot(q, (snapshot) => {
        listaImoveisContainer.innerHTML = "";
        snapshot.forEach((documento) => {
            const imovel = documento.data();
            const id = documento.id;
            const cardHTML = `
                <div class="imovel-item">
                    <img src="${imovel.imagemUrl}" alt="${imovel.titulo}">
                    <div class="imovel-info">
                        <h5>${imovel.titulo}</h5>
                        <p class="imovel-detalhes">${imovel.quartos} qts • ${imovel.banheiros} banh • ${imovel.area}m²</p>
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
    // EXCLUIR
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
                    Swal.fire({
                        title: 'Excluído!',
                        text: 'O imóvel evaporou do banco de dados.',
                        icon: 'success',
                        confirmButtonColor: '#296b48'
                    });
                }
            });
        };
    });

    // EDITAR
    document.querySelectorAll('.btn-editar').forEach(botao => {
        botao.onclick = async (e) => {
            idEdicao = e.target.getAttribute('data-id');
            const docRef = doc(db, "imoveis", idEdicao);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const dados = docSnap.data();
                document.getElementById('titulo').value = dados.titulo;
                document.getElementById('quartos').value = dados.quartos;
                document.getElementById('banheiros').value = dados.banheiros;
                document.getElementById('descricao').value = dados.descricao;
                document.getElementById('vagas').value = dados.vagas;
                document.getElementById('area').value = dados.area;
                document.getElementById('preco').value = dados.preco;
                
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
// 3. LÓGICA DE FORMULÁRIO (SALVAR OU ATUALIZAR)
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
            const resImg = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: formData
            });
            const dadosImg = await resImg.json();
            urlFinal = dadosImg.data.display_url;
        }

        const dadosImovel = {
            titulo: document.getElementById('titulo').value,
            quartos: Number(document.getElementById('quartos').value),
            banheiros: Number(document.getElementById('banheiros').value),
            descricao: document.getElementById('descricao').value,
            vagas: Number(document.getElementById('vagas').value),
            area: Number(document.getElementById('area').value),
            preco: Number(document.getElementById('preco').value)
        };

        if (urlFinal) dadosImovel.imagemUrl = urlFinal;

        if (idEdicao) {
            await updateDoc(doc(db, "imoveis", idEdicao), dadosImovel);
            Swal.fire({
                title: 'Atualizado!',
                text: 'As informações foram atualizadas com sucesso.',
                icon: 'success',
                confirmButtonColor: '#296b48'
            });
            idEdicao = null;
        } else {
            if (!arquivoSelecionado) throw new Error("Selecione uma foto para cadastrar um novo imóvel!");
            dadosImovel.dataCriacao = new Date();
            dadosImovel.imagemUrl = urlFinal;
            await addDoc(collection(db, "imoveis"), dadosImovel);
            Swal.fire({
                title: 'Sucesso!',
                text: 'Imóvel cadastrado com sucesso!',
                icon: 'success',
                confirmButtonColor: '#296b48'
            });
        }

        form.reset();
        submitBtn.textContent = "Cadastrar Imóvel";
        submitBtn.style.backgroundColor = ""; 
        arquivoSelecionado = null;
        dropZone.querySelector('p').textContent = "Arraste uma foto aqui ou clique para fazer upload";

    } catch (error) {
        Swal.fire({
            title: 'Ops, algo deu errado!',
            text: error.message,
            icon: 'error',
            confirmButtonColor: '#296b48'
        });
    } finally {
        submitBtn.disabled = false;
    }
});