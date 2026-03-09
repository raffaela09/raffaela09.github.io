import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBpCgZ-jArpS13cQFIWZbnVhylcGSXb608",
    authDomain: "topo-engenharia.firebaseapp.com",
    projectId: "topo-engenharia",
    storageBucket: "topo-engenharia.firebasestorage.app",
    messagingSenderId: "565718749371",
    appId: "1:565718749371:web:f47ca2c53cbca90850199e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // O Segurança do Login!

const form = document.getElementById('form-login');
const msgErro = document.getElementById('msg-erro');
const btn = form.querySelector('button');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    btn.textContent = "Conectando...";
    msgErro.style.display = "none";

    try {
        // Tenta logar no cofre do Google
        await signInWithEmailAndPassword(auth, email, senha);
        // Se deu certo, ele chuta você lá pra dentro do painel!
        window.location.replace("./");
    } catch (error) {
        // Se errou a senha, mostra o erro
        console.error(error);
        msgErro.style.display = "block";
        btn.textContent = "Entrar";
    }
});