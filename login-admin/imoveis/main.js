import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. ANO NO FOOTER
    // ==========================================
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ==========================================
    // 2. ANIMAÇÃO (A parte que eu tinha esquecido!)
    // ==========================================
    const revealEls = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && revealEls.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-in");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealEls.forEach((el) => observer.observe(el));
    } else {
        // fallback
        revealEls.forEach((el) => el.classList.add("is-in"));
    }

    // ==========================================
    // 3. FILTROS
    // ==========================================
    const fTipo = document.getElementById("fTipo");
    const fStatus = document.getElementById("fStatus");
    const fCidade = document.getElementById("fCidade");
    const btnLimpar = document.getElementById("btnLimpar");

    function aplicarFiltros() {
        const cards = document.querySelectorAll(".imovelCard");
        if (!cards.length) return;

        const tipo = fTipo ? fTipo.value : "all";
        const status = fStatus ? fStatus.value : "all";
        const cidade = fCidade ? fCidade.value : "all";

        cards.forEach((card) => {
            const matchTipo = tipo === "all" || card.dataset.tipo === tipo;
            const matchStatus = status === "all" || card.dataset.status === status;
            const matchCidade = cidade === "all" || card.dataset.cidade === cidade;

            if (matchTipo && matchStatus && matchCidade) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    }

    if (fTipo) fTipo.addEventListener("change", aplicarFiltros);
    if (fStatus) fStatus.addEventListener("change", aplicarFiltros);
    if (fCidade) fCidade.addEventListener("change", aplicarFiltros);

    if (btnLimpar) {
        btnLimpar.addEventListener("click", () => {
            if (fTipo) fTipo.value = "all";
            if (fStatus) fStatus.value = "all";
            if (fCidade) fCidade.value = "all";
            aplicarFiltros();
        });
    }

    // ==========================================
    // 4. CARREGAR DO FIREBASE E MONTAR CARDS
    // ==========================================
    async function carregarImoveis() {
        const imoveisGrid = document.getElementById('imoveisGrid');
        if (!imoveisGrid) return;

        try {
            const q = query(collection(db, "imoveis"), orderBy("dataCriacao", "desc"));
            const querySnapshot = await getDocs(q);
            
            imoveisGrid.innerHTML = ""; 

            querySnapshot.forEach((doc) => {
                const imovel = doc.data();

                const labelStatus = imovel.modalidade === 'locacao' ? 'Locação' : 'Venda';
                const labelPreco = imovel.modalidade === 'locacao' ? `R$ ${Number(imovel.preco).toLocaleString('pt-BR')}/mês` : `R$ ${Number(imovel.preco).toLocaleString('pt-BR')}`;
                const textoWhats = encodeURIComponent(`Olá! Tenho interesse no imóvel: ${imovel.titulo}. Pode me passar mais informações?`);

                const cardHTML = `
                    <article class="imovelCard reveal is-in" data-tipo="${imovel.tipoImovel}" data-status="${imovel.modalidade}" data-cidade="${imovel.cidade}">
                        <img class="imovelCard__img" src="${imovel.imagemUrl}" alt="${imovel.titulo}" loading="lazy" onerror="this.style.display='none'; this.closest('.imovelCard').classList.add('noimg');">

                        <div class="imovelCard__body">
                            <div class="imovelCard__badges">
                                <span class="tag tag--green">${labelStatus}</span>
                                <span class="tag" style="text-transform: capitalize;">${imovel.tipoImovel}</span>
                            </div>

                            <h3 class="imovelCard__title">${imovel.titulo}</h3>

                            <p class="imovelCard__desc">
                                ${imovel.descricao}
                            </p>

                            <div class="imovelMeta">
                                <span>${imovel.quartos} quartos</span>
                                <span>${imovel.banheiros} banheiros</span>
                                <span>${imovel.vagas} vagas</span>
                                <span>${imovel.area} m²</span>
                            </div>

                            <div class="imovelFoot">
                                <div class="preco">${labelPreco}</div>
                                <a class="btn btn--primary" target="_blank" rel="noopener"
                                   href="https://wa.me/5567984547352?text=${textoWhats}">
                                  Ver detalhes
                                </a>
                            </div>
                        </div>
                    </article>
                `;
                
                imoveisGrid.innerHTML += cardHTML;
            });

            aplicarFiltros();

        } catch (error) {
            console.error("Erro ao carregar do Firebase:", error);
            imoveisGrid.innerHTML = "<p style='text-align:center; width:100%;'>Ops! Erro ao carregar os imóveis. Atualize a página.</p>";
        }
    }

    carregarImoveis();
});