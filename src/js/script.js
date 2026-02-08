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