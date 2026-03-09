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
    // 2. ANIMAÇÃO REVEAL
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
        revealEls.forEach((el) => el.classList.add("is-in"));
    }

    // ==========================================
    // 3. FILTROS (AGORA BLINDADOS)
    // ==========================================
    const fTipo = document.getElementById("fTipo");
    const fStatus = document.getElementById("fStatus");
    const fCidade = document.getElementById("fCidade");
    const btnLimpar = document.getElementById("btnLimpar");
    const imoveisGrid = document.getElementById('imoveisGrid');

    function aplicarFiltros() {
        const cards = document.querySelectorAll(".imovelCard");
        if (!cards.length || !imoveisGrid) return;

        // Pega o valor do filtro e já força pra minúsculo pra evitar erro bobo
        const tipo = fTipo ? fTipo.value.toLowerCase() : "all";
        const status = fStatus ? fStatus.value.toLowerCase() : "all";
        const cidade = fCidade ? fCidade.value.toLowerCase() : "all";

        let imoveisVisiveis = 0;

        cards.forEach((card) => {
            // Pega o que tá no banco e também força pra minúsculo
            const cardTipo = (card.dataset.tipo || "").toLowerCase();
            const cardStatus = (card.dataset.status || "").toLowerCase();
            const cardCidade = (card.dataset.cidade || "").toLowerCase();

            const matchTipo = tipo === "all" || cardTipo === tipo;
            const matchStatus = status === "all" || cardStatus === status;
            const matchCidade = cidade === "all" || cardCidade === cidade;

            if (matchTipo && matchStatus && matchCidade) {
                card.style.display = ""; // Mostra o card
                imoveisVisiveis++;
            } else {
                card.style.display = "none"; // Esconde o card
            }
        });

        // MÁGICA DE UX: Mostra mensagem amigável se o filtro não achar nada!
        let msgVazia = document.getElementById("msg-vazia");
        if (imoveisVisiveis === 0) {
            if (!msgVazia) {
                msgVazia = document.createElement("div");
                msgVazia.id = "msg-vazia";
                msgVazia.style.gridColumn = "1 / -1"; // Ocupa a linha toda
                msgVazia.style.textAlign = "center";
                msgVazia.style.padding = "60px 20px";
                msgVazia.innerHTML = `
                    <h3 style="color: var(--text); margin-bottom: 10px; font-size: 1.5rem;">Poxa, nenhum imóvel encontrado! 😕</h3>
                    <p style="color: var(--muted);">Tente mudar os filtros ou clique em "Limpar Filtros" para ver mais opções.</p>
                `;
                imoveisGrid.appendChild(msgVazia);
            }
            msgVazia.style.display = "block";
        } else {
            if (msgVazia) msgVazia.style.display = "none";
        }
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
        if (!imoveisGrid) return;

        try {
            const q = query(collection(db, "imoveis"), orderBy("dataCriacao", "desc"));
            const querySnapshot = await getDocs(q);
            
            let htmlDosCards = ""; // Guarda todos os cards antes de jogar na tela (mais rápido)

            querySnapshot.forEach((doc) => {
                const imovel = doc.data();

                const labelStatus = imovel.modalidade === 'locacao' ? 'Locação' : 'Venda';
                const labelPreco = imovel.modalidade === 'locacao' ? `R$ ${Number(imovel.preco).toLocaleString('pt-BR')}/mês` : `R$ ${Number(imovel.preco).toLocaleString('pt-BR')}`;
                const textoWhats = encodeURIComponent(`Olá! Tenho interesse no imóvel: ${imovel.titulo}. Pode me passar mais informações?`);

                let metaHTML = "";
                if (imovel.tipoImovel === 'terreno') {
                    metaHTML = `<span>${imovel.area} m²</span>`;
                } else {
                    metaHTML = `
                        <span>${imovel.quartos} quartos</span>
                        <span>${imovel.banheiros} banheiros</span>
                        <span>${imovel.vagas} vagas</span>
                        <span>${imovel.area} m²</span>
                    `;
                }

                htmlDosCards += `
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
                                ${metaHTML}
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
            });

            // Joga todos os cards na tela de uma vez só!
            imoveisGrid.innerHTML = htmlDosCards;

            // Chama a função para garantir que já comece filtrado (caso tenha algum valor)
            aplicarFiltros();

        } catch (error) {
            console.error("Erro ao carregar do Firebase:", error);
            imoveisGrid.innerHTML = "<p style='text-align:center; width:100%; color: var(--muted); padding: 40px;'>Ops! Erro ao carregar os imóveis. Atualize a página.</p>";
        }
    }

    carregarImoveis();
});