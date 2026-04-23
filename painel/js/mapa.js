window.addEventListener("load", () => {

    // ===============================
    // ESTADO GLOBAL DO MAPA
    // ===============================
    let map;
    let rotaAtual = null; // guarda a linha atual

    const mapaDiv = document.getElementById("mapa");
    if (!mapaDiv) return;

    // ===============================
    // INICIALIZA MAPA (APENAS UMA VEZ)
    // ===============================
    function initMapa() {

        map = L.map('mapa', {
            zoomControl: true
        }).setView([-8.9, 13.25], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // força correção de layout
        setTimeout(() => {
            map.invalidateSize();
        }, 500);
    }

    initMapa();

    // ===============================
    // ÍCONE PERSONALIZADO (sem PNG)
    // ===============================
    const iconFA = L.divIcon({
        className: "custom-icon",
        html: '<i class="fa-solid fa-location-dot" style="color:#2563eb; font-size:22px;"></i>',
        iconSize: [22, 22],
        iconAnchor: [11, 22]
    });

    // ===============================
    // ROTAS DISPONÍVEIS (EDITÁVEL)
    // ===============================
    const rotas = {
        "Rota-1": {
            nome: "KM 30 → 1º de Maio",
            start: [-8.968213, 13.471105],
            end:   [-8.828140, 13.243203]
        },
        "Rota-2": {
            nome: "Viana → Cacuaco",
            start: [-8.895, 13.37],
            end:   [-8.758, 13.42]
        },
        "Rota-3": {
            nome: "Zango → Zango 8000",
            start: [-8.88, 13.28],
            end:   [-8.82, 13.30]
        },
        "Rota-4": {
            nome: "1º de Maio → Benfica",
            start: [-8.828140, 13.243203],
            end:   [-8.90, 13.18]
        }
    };

    // ===============================
    // FUNÇÃO PARA DESENHAR ROTA
    // ===============================
    function desenharRota(start, end) {

        // remove rota anterior
        if (rotaAtual) {
            map.removeLayer(rotaAtual);
        }

        // remove markers antigos
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // adiciona novos markers
        L.marker(start, { icon: iconFA }).addTo(map);
        L.marker(end, { icon: iconFA }).addTo(map);

        // chama API OSRM
        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

        fetch(url)
            .then(res => res.json())
            .then(data => {

                const route = data.routes[0].geometry;

                rotaAtual = L.geoJSON(route, {
                    style: {
                        color: '#2563eb',
                        weight: 5
                    }
                }).addTo(map);

                map.fitBounds(rotaAtual.getBounds());

                // força correção visual
                setTimeout(() => {
                    map.invalidateSize();
                }, 300);
            });
    }

    // ===============================
    // EVENTO DOS BOTÕES "MONITORAR"
    // ===============================
    const botoes = document.querySelectorAll(".formBotao button");

    botoes.forEach(botao => {

        botao.addEventListener("click", () => {

            // encontra qual modal está ativo
            const modal = botao.closest(".info");
            if (!modal) return;

            // pega ID do modal (ex: infoRota-1)
            const id = modal.id.replace("info", "");

            const rota = rotas[id];
            if (!rota) return;

            // mostra mapa
            const containerMapa = document.querySelector(".conteinerMapa");
            containerMapa.classList.add("active");

            // desenha rota
            desenharRota(rota.start, rota.end);

            // atualiza texto informativo
            const spans = containerMapa.querySelectorAll("span");
            spans[0].textContent = rota.nome;
            spans[1].textContent = "Ida"; // podes ligar ao select depois

            // corrige renderização
            setTimeout(() => {
                map.invalidateSize();
            }, 400);

        });

    });

});
