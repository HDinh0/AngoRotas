window.addEventListener("DOMContentLoaded", () => {
    const btns = document.querySelectorAll("section#segunda section.rotas div.rota");
    
    btns.forEach(btn => {
        btn.addEventListener("click", ()=>{
            const boxId = "info".concat(btn.id)
            const box = document.getElementById(boxId)
            
            box.classList.add("active");

            box.addEventListener("click", (e)=>{
                var clicouFora = box == e.target ? true : false;
                if (clicouFora) {
                    box.classList.remove("active");
                }
            });
        });
    });
});