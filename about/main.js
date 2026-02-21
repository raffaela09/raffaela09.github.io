document.documentElement.classList.add("js");

document.getElementById("year").textContent = String(new Date().getFullYear());

// Reveal simples (fica chique sem ser exagerado)
const els = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add("show");
      io.unobserve(e.target);
    }
  }
}, { threshold: 0.12 });

els.forEach(el => io.observe(el));
