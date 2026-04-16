window.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll('.conteiner .box');

    boxes.forEach(box => {
        box.addEventListener('click', () => {

            const p = box.querySelector('p');
            const iconeAtual = box.querySelector('h3 i');
            const isActive = p.classList.contains('active');

            // fecha todos
            boxes.forEach(b => {
                const pItem = b.querySelector('p');
                const icone = b.querySelector('h3 i');

                if (pItem) pItem.classList.remove('active');

                if (icone) {
                    icone.classList.remove('fa-minus');
                    icone.classList.add('fa-plus');
                }
            });

            // abre só se não estava aberto
            if (!isActive) {
                if (p) p.classList.add('active');

                if (iconeAtual) {
                    iconeAtual.classList.remove('fa-plus');
                    iconeAtual.classList.add('fa-minus');
                }
            }
        });
    });
});
