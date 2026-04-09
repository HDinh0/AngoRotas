window.addEventListener("DOMContentLoaded", () => {
    const sliders = document.querySelector(".sliders");
    const slides = document.querySelectorAll(".slide");

    const btnUp = document.getElementById("subir");
    const btnDown = document.getElementById("descer");

    let index = 0;
    const totalSlides = slides.length;

    let isAnimating = false;

    // Atualiza posição do slider
    function updateSlide() {
        sliders.style.transform = `translateY(-${index * 100}dvh)`;

        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
        }, 500); // tempo igual ao CSS
    }

    // Subir
    function slideUp() {
        if (index <= 0 || isAnimating) return;
        index--;
        updateSlide();
    }

    // Descer
    function slideDown() {
        if (index >= totalSlides - 1 || isAnimating) return;
        index++;
        updateSlide();
    }

    // Botões
    btnUp.addEventListener("click", slideUp);
    btnDown.addEventListener("click", slideDown);

    // SCROLL DO MOUSE
    window.addEventListener("wheel", (e) => {
        if (isAnimating) return;

        if (e.deltaY > 0) {
            slideDown();
        } else {
            slideUp();
        }
    });

    // TOUCH (SWIPE)
    let startY = 0;
    let endY = 0;

    window.addEventListener("touchstart", (e) => {
        startY = e.touches[0].clientY;
    });

    window.addEventListener("touchend", (e) => {
        endY = e.changedTouches[0].clientY;

        handleSwipe();
    });

    function handleSwipe() {
        let diff = startY - endY;

        if (Math.abs(diff) < 50) return; // evita micro movimentos

        if (diff > 0) {
            // dedo subiu → vai para baixo (próximo slide)
            slideDown();
        } else {
            // dedo desceu → vai para cima (slide anterior)
            slideUp();
        }
    }
});
