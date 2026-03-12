document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. ANIMAÇÃO DE APARECER (Scroll Reveal)
    // ==========================================
    const revealEls = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && revealEls.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show"); 
                    entry.target.classList.add("is-in"); 
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach((el) => {
            el.classList.add("show");
            el.classList.add("is-in");
        });
    }

    // ==========================================
    // 2. MENU MOBILE RESPONSIVO
    // ==========================================
    const btnMenu = document.querySelector('.mobile-menu-icon button'); 
    const menuMobile = document.querySelector('.mobile-menu');
    const icon = document.querySelector('.mobile-menu-icon i');

    if (btnMenu && menuMobile && icon) {
        btnMenu.addEventListener('click', (event) => {
            event.stopPropagation(); 
            
            menuMobile.classList.toggle('open');
            
            if (menuMobile.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        document.addEventListener('click', (event) => {
            if (menuMobile.classList.contains('open') && !menuMobile.contains(event.target)) {
                menuMobile.classList.remove('open');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // ==========================================
    // 3. ANIMAÇÃO DE CRESCIMENTO DOS NÚMEROS
    // ==========================================
    const counters = document.querySelectorAll(".counter");

    function animateCounter(counter) {
        const target = +counter.getAttribute("data-target");
        const prefix = counter.getAttribute("data-prefix") || "";
        const suffix = counter.getAttribute("data-suffix") || "";

        let current = 0;
        const duration = 2000;
        const increment = target / (duration / 16);

        const updateCounter = () => {
            current += increment;

            if (current < target) {
                counter.textContent = prefix + Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = prefix + target + suffix;
            }
        };

        updateCounter();
    }

    // Chama a função para cada número (Correção do plural/singular aplicada aqui!)
    if (counters.length > 0) {
        counters.forEach(counter => {
            animateCounter(counter); 
        });
    }
});

// ==========================================
// 4. FORMULÁRIO DE LOGIN (Cuidado aqui!)
// ==========================================
// Aviso: Verifique se as variáveis form, btn, msgErro e auth estão declaradas 
// em algum lugar do seu código antes disso, senão a página inteira vai quebrar!
const form = document.querySelector('form'); // Exemplo de declaração (ajuste conforme seu HTML)

if(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        // Garanta que os botões existem antes de mudar o textContent
        const btn = document.querySelector('button[type="submit"]'); 
        const msgErro = document.getElementById('msgErro');

        if(btn) btn.textContent = "Conectando...";
        if(msgErro) msgErro.style.display = "none";

        try {
            await signInWithEmailAndPassword(auth, email, senha);
            window.location.replace("./");
        } catch (error) {
            console.error(error);
            if(msgErro) msgErro.style.display = "block";
            if(btn) btn.textContent = "Entrar";
        }
    });
}