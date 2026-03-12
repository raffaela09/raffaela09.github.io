// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal animation
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    }
  }
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// Count-up for "Topo em números"
  const counters = document.querySelectorAll(".counter");

  //funcao para animar os números do card hero
  function animateCounter(counter){
      const target = +counter.getAttribute("data-target");
      const prefix = counter.getAttribute("data-prefix") || "";
      const suffix = counter.getAttribute("data-suffix") || "";

      let current = 0;
      const duration = 2000;
      const increment = target / (duration / 16);

      const updateCounter = () => {
          current += increment;

          if(current < target){
              counter.textContent =
                  prefix + Math.floor(current) + suffix;
              requestAnimationFrame(updateCounter);
          } else {
              counter.textContent =
                  prefix + target + suffix;
          }
      };

      updateCounter();
  }

  //para ativar a funcao sempre que a pagina carregar
  document.addEventListener("DOMContentLoaded", () => {
      const counters = document.querySelectorAll(".counter");

      counters.forEach(counter => {
          animateCounter(counter);
      });
  });


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
