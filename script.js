const menuBtnc = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');

menuBtnc.addEventListener('click', function() {
    menu.classList.toggle('active');
})

document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && !menuBtnc.contains(event.target)) {
        menu.classList.remove('active');
    }
})