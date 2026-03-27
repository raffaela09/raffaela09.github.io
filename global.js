document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        // Pega a URL raiz do site e joga pro admin
        window.location.href = window.location.origin + '/admin/';
    }
});

// Cria e injeta o botão do WhatsApp dinamicamente
function criarBotaoWhatsApp() {
    const btn = document.createElement('a');
    
    // O link do zap da Topo Engenharia
    btn.href = "https://wa.me/5567984547352?text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20uma%20análise%20técnica.";
    btn.target = "_blank"; // Abre em nova aba
    btn.className = "btn-whatsapp-flutuante"; // Aplica o CSS que criamos
    btn.ariaLabel = "Falar no WhatsApp";
    
    // Coloca o ícone do FontAwesome dentro do botão
    btn.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
    
    // Adiciona o botão no final do <body>
    document.body.appendChild(btn);
}

// Carrega o botão assim que a página renderizar
document.addEventListener('DOMContentLoaded', criarBotaoWhatsApp);