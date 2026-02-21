function showMenu(){
    let menuMobile = document.querySelector('.mobile-menu')
    let icon = document.querySelector('.mobile-menu-icon i')


   if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    } else {
        menuMobile.classList.add('open');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    }
}

//para clicar fora do menu, fechar
document.addEventListener('click', function(event) {
    let menuMobile = document.querySelector('.mobile-menu');
    let menuButton = document.querySelector('.mobile-menu-icon');

    let icon = document.querySelector('.mobile-menu-icon i');
    if (
        menuMobile.classList.contains('open') &&
        !menuMobile.contains(event.target) &&
        !menuButton.contains(event.target)
    ) {
        menuMobile.classList.remove('open');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});

function enviarParaWhatsApp() {
    // 1. Pega os valores que o usuário digitou nos campos
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const mensagem = document.getElementById('mensagem').value;

    // 2. Faz uma validação rápida para ver se o nome e a mensagem não estão vazios
    if (nome.trim() === '' || mensagem.trim() === '') {
        alert("Por favor, preencha pelo menos o seu nome e a mensagem para podermos te atender melhor!");
        return; // Para a execução da função aqui se estiver vazio
    }

    // 3. Monta o textinho bonitinho que vai chegar no WhatsApp
    // O \n serve para pular linha. Os asteriscos * deixam o texto em negrito no zap.
    const texto = `Olá! Vim pelo site da Topo Engenharia.\n\n*Nome:* ${nome}\n*E-mail:* ${email}\n*Telefone:* ${telefone}\n*Mensagem:* ${mensagem}`;

    // 4. Codifica o texto para o formato de link (troca os espaços por %20, etc)
    const textoCodificado = encodeURIComponent(texto);

    // 5. O número do WhatsApp da Topo (somente números, com código do país 55)
    const numeroWhatsApp = "5567984547352"; 
    
    // 6. Monta o link final da API do WhatsApp
    const url = `https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`;

    // 7. Abre o WhatsApp em uma nova aba do navegador
    window.open(url, '_blank');
}