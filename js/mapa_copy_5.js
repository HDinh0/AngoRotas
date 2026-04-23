document.addEventListener("DOMContentLoaded", () => {

    let map;
    let mapaInicializado = false;

    function criarMapa() {
        if (mapaInicializado) return;

        const mapaDiv = document.getElementById("mapa");
        if (!mapaDiv) return;

        map = L.map('mapa').setView([-8.9, 13.25], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Ícone com Font Awesome
        const iconFA = L.divIcon({
            className: "custom-icon",
            html: '<i class="fa-solid fa-location-dot" style="color:#2563eb; font-size:24px;"></i>',
            iconSize: [24, 24],
            iconAnchor: [12, 24]
        });

        const start = [-8.968213, 13.471105];
        const end   = [-8.828140, 13.243203];

        L.marker(start, { icon: iconFA }).addTo(map);
        L.marker(end, { icon: iconFA }).addTo(map);

        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const route = data.routes[0].geometry;

                const routeLine = L.geoJSON(route, {
                    style: {
                        color: '#2563eb',
                        weight: 5
                    }
                }).addTo(map);

                map.fitBounds(routeLine.getBounds());

                // 🔥 força correção do layout
                setTimeout(() => map.invalidateSize(), 200);
            })
            .catch(err => console.error("Erro ao carregar rota:", err));

        mapaInicializado = true;
    }

    // 🔍 Tenta encontrar container (pode não existir)
    const container = document.querySelector(".conteinerMapa");

    if (container) {
        // Usa observer só se existir
        const observer = new MutationObserver(() => {
            if (container.classList.contains("active")) {
                setTimeout(() => criarMapa(), 200);
            }
        });

        observer.observe(container, {
            attributes: true,
            attributeFilter: ["class"]
        });

        // fallback
        if (container.classList.contains("active")) {
            criarMapa();
        }

    } else {
        // 🚀 cenário simples → cria direto
        criarMapa();
    }

});
