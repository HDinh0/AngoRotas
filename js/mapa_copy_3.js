document.addEventListener("DOMContentLoaded", () => {

    let map;
    let mapaInicializado = false;

    function criarMapa() {
        if (mapaInicializado) return;

        const mapaDiv = document.getElementById("mapa");

        // Só cria se estiver visível
        if (!mapaDiv || mapaDiv.offsetHeight === 0) return;

        map = L.map('mapa').setView([-8.9, 13.25], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // 🎯 Ícone custom com Font Awesome
        const iconFA = L.divIcon({
            className: "custom-icon",
            html: '<i class="fa-solid fa-location-dot" style="color:#2563eb; font-size:24px;"></i>',
            iconSize: [24, 24],
            iconAnchor: [12, 24]
        });

        const start = [-8.968213, 13.471105];
        const end   = [-8.828140, 13.243203];

        L.marker(start, { icon: iconFA }).addTo(map).bindPopup("KM 30");
        L.marker(end, { icon: iconFA }).addTo(map).bindPopup("1º de Maio");

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

                // 🔥 CORREÇÃO FORTE (resolve fragmentação)
                requestAnimationFrame(() => {
                    map.invalidateSize();
                });

                setTimeout(() => map.invalidateSize(), 300);
                setTimeout(() => map.invalidateSize(), 1000);
            })
            .catch(err => console.error("Erro ao carregar rota:", err));

        mapaInicializado = true;
    }

    // Observa quando o container fica visível
    const container = document.querySelector(".conteinerMapa");

    const observer = new MutationObserver(() => {
        if (container.classList.contains("active")) {
            setTimeout(() => {
                criarMapa();

                // 🔥 força ajuste mesmo após ativação
                if (map) {
                    setTimeout(() => map.invalidateSize(), 300);
                    setTimeout(() => map.invalidateSize(), 800);
                }

            }, 200);
        }
    });

    observer.observe(container, {
        attributes: true,
        attributeFilter: ["class"]
    });

    // fallback (caso já esteja visível ao carregar)
    setTimeout(() => {
        criarMapa();

        if (map) {
            setTimeout(() => map.invalidateSize(), 300);
        }
    }, 500);

});
