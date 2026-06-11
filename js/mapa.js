window.addEventListener("load", () => {

    // ===============================
    // ESTADO GLOBAL DO MAPA
    // ===============================
    let map;
    let rotaAtual = null; // guarda a linha atual
    let autocarroMarker = null; // guarda o marker do autocarro
    let animacaoId = null; // guarda o ID da animação

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
    // ÍCONE AUTOCARRO
    // ===============================
    function criarIconeAutocarro(rotacao) {
        return L.divIcon({
            className: "autocarro-icon",
            html: `<div style="font-size:28px; transform: rotate(${rotacao}deg);">🚌</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });
    }

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
            start: [-8.906600658862967, 13.376457956758506],
            end:   [-8.778024233155598, 13.371592155563112]
        },
        "Rota-3": {
            nome: "Zango → Zango 8000",
            start: [-8.979428228603988, 13.391493488096229],
            end:   [-9.075874202945243, 13.457581450849892]
        },
        "Rota-4": {
            nome: "1º de Maio → Benfica",
            start: [-8.828140, 13.243203],
            end:   [-8.93554857464198, 13.16194660289763]
        }
    };

    // ===============================
    // FUNÇÕES AUXILIARES PARA MOVIMENTO
    // ===============================

    // Calcula distância entre dois pontos (lat/lon)
    function calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371000; // raio da terra em metros
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Calcula bearing (ângulo de rotação) entre dois pontos
    function calcularBearing(lat1, lon1, lat2, lon2) {
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
        const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
                  Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
        let bearing = Math.atan2(y, x) * 180 / Math.PI;
        bearing = (bearing + 360) % 360;
        return bearing;
    }

    // Interpola um ponto entre dois pontos (0 = inicio, 1 = fim)
    function interpolarPonto(lat1, lon1, lat2, lon2, t) {
        const lat = lat1 + (lat2 - lat1) * t;
        const lon = lon1 + (lon2 - lon1) * t;
        return [lat, lon];
    }

    // Obtém um ponto na rota GeoJSON baseado na percentagem (0-1)
    function obterPontoNaRota(coords, percentagem) {
        percentagem = Math.max(0, Math.min(1, percentagem)); // clamp 0-1

        let distanciaTotal = 0;
        const distancias = [0];

        // Calcula distâncias cumulativas
        for (let i = 0; i < coords.length - 1; i++) {
            const d = calcularDistancia(
                coords[i][1], coords[i][0],
                coords[i + 1][1], coords[i + 1][0]
            );
            distanciaTotal += d;
            distancias.push(distanciaTotal);
        }

        const distanciaAlvo = distanciaTotal * percentagem;
        let indice = 0;

        // Encontra o segmento onde estamos
        for (let i = 0; i < distancias.length; i++) {
            if (distancias[i] >= distanciaAlvo) {
                indice = i - 1;
                break;
            }
        }

        indice = Math.max(0, indice);

        if (indice >= coords.length - 1) {
            return coords[coords.length - 1];
        }

        // Interpola dentro do segmento
        const distanciaSegmento = distancias[indice + 1] - distancias[indice];
        const tLocal = distanciaSegmento > 0
            ? (distanciaAlvo - distancias[indice]) / distanciaSegmento
            : 0;

        const ponto = interpolarPonto(
            coords[indice][1], coords[indice][0],
            coords[indice + 1][1], coords[indice + 1][0],
            tLocal
        );

        return ponto;
    }

    // Anima o autocarro ao longo da rota
    function animarAutocarro(coords) {
        if (animacaoId !== null) {
            cancelAnimationFrame(animacaoId);
        }

        let progressoPercentagem = 0.2; // começa a 20%
        const velocidade = 0.00008; // incremento por frame
        const maxPercentagem = 1.0; // até 100%

        function atualizarPosicao() {
            if (progressoPercentagem < maxPercentagem) {
                const [lat, lon] = obterPontoNaRota(coords, progressoPercentagem);

                // Calcula o bearing para a próxima posição
                const proximaPercentagem = progressoPercentagem + velocidade;
                const [proxLat, proxLon] = obterPontoNaRota(coords, proximaPercentagem);
                const bearing = (calcularBearing(lat, lon, proxLat, proxLon) - 90 + 360) % 360;

                // Atualiza ou cria o marker
                if (!autocarroMarker) {
                    autocarroMarker = L.marker([lat, lon], {
                        icon: criarIconeAutocarro(bearing)
                    }).addTo(map);
                } else {
                    autocarroMarker.setLatLng([lat, lon]);
                    autocarroMarker.setIcon(criarIconeAutocarro(bearing));
                }

                progressoPercentagem += velocidade;
                animacaoId = requestAnimationFrame(atualizarPosicao);
            } else {
                // Autocarro chegou ao final
                const [lat, lon] = obterPontoNaRota(coords, 1.0);
                if (autocarroMarker) {
                    autocarroMarker.setLatLng([lat, lon]);
                }
                animacaoId = null;
            }
        }

        atualizarPosicao();
    }

    // ===============================
    // FUNÇÃO PARA DESENHAR ROTA
    // ===============================
    function desenharRota(start, end) {

        // remove rota anterior
        if (rotaAtual) {
            map.removeLayer(rotaAtual);
        }

        // remove autocarro anterior
        if (autocarroMarker) {
            map.removeLayer(autocarroMarker);
            autocarroMarker = null;
        }

        // cancela animação anterior
        if (animacaoId !== null) {
            cancelAnimationFrame(animacaoId);
            animacaoId = null;
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

                // Inicia animação do autocarro após 1.5 segundos
                setTimeout(() => {
                    animarAutocarro(route.coordinates);
                }, 1500);
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
