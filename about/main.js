// document.documentElement.classList.add("js");

// document.getElementById("year").textContent = String(new Date().getFullYear());

// // Reveal simples (fica chique sem ser exagerado)
// const els = document.querySelectorAll(".reveal");
// const io = new IntersectionObserver((entries) => {
//   for (const e of entries) {
//     if (e.isIntersecting) {
//       e.target.classList.add("show");
//       io.unobserve(e.target);
//     }
//   }
// }, { threshold: 0.12 });

// els.forEach(el => io.observe(el));


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