window.addEventListener("DOMContentLoaded", () => {
    const btnEntrar = document.getElementById("entrar");
    const btnCriar = document.getElementById("criar");

    const toggle = document.querySelector(".toggle");

    const formEntrar = document.getElementById("conteinerEntrar");
    const formCriar = document.getElementById("conteinerCriar");

    let ativo = "entrar";

    function mostrarEntrar() {
        if (ativo === "entrar") return;

        // animação
        formEntrar.classList.add("active");
        formCriar.classList.add("saindo-direita");

        setTimeout(() => {
            formCriar.classList.remove("active", "saindo-direita");
        }, 400);

        toggle.classList.remove("criar");
        ativo = "entrar";
    }

    function mostrarCriar() {
        if (ativo === "criar") return;

        formCriar.classList.add("active");
        formEntrar.classList.add("saindo-esquerda");

        setTimeout(() => {
            formEntrar.classList.remove("active", "saindo-esquerda");
        }, 400);

        toggle.classList.add("criar");
        ativo = "criar";
    }

    btnEntrar.addEventListener("click", mostrarEntrar);
    btnCriar.addEventListener("click", mostrarCriar);
});
