document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. ANIMAÇÃO DE APARECER (Scroll Reveal)
    // ==========================================
    const revealEls = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && revealEls.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show"); // Classe usada dependendo do CSS
                    entry.target.classList.add("is-in"); // Mantendo as duas por segurança de compatibilidade
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealEls.forEach((el) => observer.observe(el));
    } else {
        // Fallback caso o navegador seja antigo
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
            event.stopPropagation(); // Impede clique acidental fora
            
            menuMobile.classList.toggle('open');
            
            if (menuMobile.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Fechar menu ao clicar fora dele
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
    const counters = document.querySelectorAll('.counter');
    const animationSpeed = 1500; // Tempo em milissegundos (1.5s)

    if ("IntersectionObserver" in window && counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetElement = entry.target;
                    const targetValue = parseInt(targetElement.getAttribute('data-target'), 10);
                    
                    let startTimestamp = null;
                    const step = (timestamp) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const progress = Math.min((timestamp - startTimestamp) / animationSpeed, 1);
                        
                        targetElement.textContent = Math.floor(progress * targetValue);
                        
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            targetElement.textContent = targetValue; // Garante o número exato no final
                        }
                    };
                    window.requestAnimationFrame(step);
                    
                    observer.unobserve(targetElement); // Anima só na primeira vez que a pessoa vê
                }
            });
        }, { threshold: 0.5 }); // Inicia só quando a tela chega na metade do card

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    } else {
        // Fallback para navegadores muito antigos
        counters.forEach(counter => {
            counter.textContent = counter.getAttribute('data-target');
        });
    }
});
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