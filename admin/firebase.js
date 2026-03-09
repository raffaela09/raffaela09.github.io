// 1. Importando APENAS o banco de dados do seu arquivo firebase.js
import { db } from './firebase.js';

// 2. Importando as funções do Firebase para salvar os textos
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// A sua chave pública do ImgBB (eu te ensino a pegar uma agorinha!)
const IMGBB_API_KEY = "e7dd42b3688bf7785b4f4dee629ef0b8"; 

const form = document.getElementById('form-imovel');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('foto-upload');
const submitBtn = form.querySelector('button[type="submit"]');

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        dropZone.querySelector('p').textContent = `Foto selecionada: ${e.target.files[0].name}`;
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const arquivoImagem = fileInput.files[0];

    if (!arquivoImagem) {
        alert("Amor, não esquece de selecionar uma foto!");
        return;
    }

    submitBtn.textContent = "Fazendo upload da foto...";
    submitBtn.disabled = true;

    try {
        // PASSO A: Enviar a foto para o ImgBB (Grátis e sem cartão!)
        const formData = new FormData();
        formData.append("image", arquivoImagem);

        const respostaImgbb = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData
        });
        
        const dadosImgbb = await respostaImgbb.json();
        
        if (!dadosImgbb.success) {
            throw new Error("Erro ao subir a imagem no ImgBB");
        }

        // Pegamos o link público que o ImgBB gerou
        const urlDaImagem = dadosImgbb.data.display_url;

        // PASSO B: Salvar tudo no nosso Firebase (Firestore)
        submitBtn.textContent = "Salvando no banco de dados...";
        
        await addDoc(collection(db, "imoveis"), {
            titulo: document.getElementById('titulo').value,
            quartos: Number(document.getElementById('quartos').value),
            banheiros: Number(document.getElementById('banheiros').value),
            descricao: document.getElementById('descricao').value,
            vagas: Number(document.getElementById('vagas').value),
            area: Number(document.getElementById('area').value),
            preco: Number(document.getElementById('preco').value),
            imagemUrl: urlDaImagem, // Salvando o link gerado pelo ImgBB!
            tipoImovel: "casa", 
            modalidade: "venda",
            cidade: "tres-lagoas",
            dataCriacao: new Date()
        });

        alert("Imóvel salvo com sucesso sem gastar 1 real!");
        form.reset();
        dropZone.querySelector('p').textContent = "Arraste uma foto aqui ou clique para fazer upload";

    } catch (error) {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao salvar. Verifique o console.");
    } finally {
        submitBtn.textContent = "Cadastrar Imóvel";
        submitBtn.disabled = false;
    }
});