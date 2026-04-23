window.addEventListener("DOMContentLoaded", () => {
    const btns = document.querySelectorAll("section#segunda section.rotas div.rota");
    const monitorarBtn = document.querySelectorAll(".formBotao button");
    
    
    btns.forEach(btn => {
        btn.addEventListener("click", ()=>{
            const boxId = "info".concat(btn.id)
            const box = document.getElementById(boxId)
            
            box.classList.add("active");

            console.log(monitorarBtn)
            monitorarBtn.forEach(moniBtn => {
                moniBtn.addEventListener("click", ()=>{
                    box.classList.remove("active");
                    window.location.href = "rotas.html#terceira";
                });
            });

            box.addEventListener("click", (e)=>{
                var clicouFora = box == e.target ? true : false;
                if (clicouFora) {
                    box.classList.remove("active");
                }
            });
        });
    });
});