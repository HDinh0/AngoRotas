window.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector("#hamburguer");
    const nav = document.querySelector("#navPagina");
    const icon = btn.querySelector("i");

    // Função para abrir/fechar menu
    function toggleMenu() {
        nav.classList.toggle("active");

        // Trocar ícone
        if (nav.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-x");
        } else {
            icon.classList.remove("fa-x");
            icon.classList.add("fa-bars");
        }
    }

    // Clique no botão
    btn.addEventListener("click", (e) => {
        e.stopPropagation(); // evita conflito com clique fora
        toggleMenu();
    });

    // Clique fora da nav
    document.addEventListener("click", (e) => {
        const clicouFora = !nav.contains(e.target) && !btn.contains(e.target);

        if (nav.classList.contains("active") && clicouFora) {
            nav.classList.remove("active");

            icon.classList.remove("fa-x");
            icon.classList.add("fa-bars");
        }
    });

    // Clique nos links
    const links = nav.querySelectorAll("a");

    links.forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");

            icon.classList.remove("fa-x");
            icon.classList.add("fa-bars");
        });
    });
});
