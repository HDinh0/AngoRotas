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
        sliders.style.transform = `translateY(-${index * 100}vh)`;

        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    function slideUp() {
        if (index <= 0 || isAnimating) return;
        index--;
        updateSlide();
    }

    function slideDown() {
        if (index >= totalSlides - 1 || isAnimating) return;
        index++;
        updateSlide();
    }

    // Botões
    btnUp.addEventListener("click", slideUp);
    btnDown.addEventListener("click", slideDown);

    // BLOQUEAR SCROLL DO MOUSE
    window.addEventListener("wheel", (e) => {
        e.preventDefault();
    }, { passive: false });

    // BLOQUEAR TOUCH (MOBILE)
    window.addEventListener("touchmove", (e) => {
        e.preventDefault();
    }, { passive: false });

    // BLOQUEAR TECLAS (setas e espaço)
    window.addEventListener("keydown", (e) => {
        const keys = ["ArrowUp", "ArrowDown", "Space"];
        if (keys.includes(e.code)) {
            e.preventDefault();
        }
    });
});
