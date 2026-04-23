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

    
    // FUNÇÃO QUE MOSTRA E OCULTA SENHAS
    function configurarToggleSenha(botaoId, inputId) {
        const botao = document.getElementById(botaoId);
        const input = document.getElementById(inputId);
        const icone = document.querySelector("#"+botaoId+" i");

        botao.addEventListener("click", function () {

            if (input.type === "password") {
                input.type = "text";
                if (icone.classList.contains("fa-eye-slash")) {
                    icone.classList.remove("fa-eye-slash");
                    icone.classList.add("fa-eye");
                }
            } else {
                input.type = "password";
                if (!icone.classList.contains("fa-eye-slash")) {
                    icone.classList.remove("fa-eye");
                    icone.classList.add("fa-eye-slash");
                }
            }
        });
    }

    // Campos de senha
    configurarToggleSenha("verSenha1", "senha1");
    configurarToggleSenha("verSenha2", "senha2");
    configurarToggleSenha("verSenha3", "senha3");
    
});
