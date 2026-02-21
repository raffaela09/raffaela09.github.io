//funcao para abrir e fechar o menu
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

// carregar conteúdo externo
fetch("content.json")
  .then(response => response.json())
  .then(data => {
    //texto da logo
    document.getElementById("logo-text").textContent =
      data.logo.text;

    //subtexto da logo
    document.getElementById("subtitle-header").textContent = 
      data.logo.subtitle
    
    document.getElementById("title-card").innerHTML =
      data.card.title

    //texto do card apos o titulo
    document.getElementById("card-text").textContent = 
      data.card.text

    document.getElementById("one").textContent = 
      data.beneficios.one
    
    document.getElementById("two").textContent =
      data.beneficios.two

    document.getElementById("three").textContent =
      data.beneficios.three
    
    const container = document.getElementById("areas-list");
    data.areas.forEach((area, index) => {

    const span = document.createElement("span");
    span.textContent = area;
    span.classList.add("area-item");

    container.appendChild(span);

      // adiciona bolinha entre itens (menos no último)
    if(index < data.areas.length - 1){
        const dot = document.createElement("span");
        dot.classList.add("area-dot");
        dot.textContent = "•";
        container.appendChild(dot);
    }

    });

    document.getElementById("title-topo-card").textContent = 
      data.info.title
  })
  .catch(error => {
    console.error("Erro ao carregar conteúdo:", error);
  });