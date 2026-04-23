document.addEventListener("DOMContentLoaded", () => {

    let map;
    let mapaInicializado = false;

    const mapaDiv = document.getElementById("mapa");
    if (!mapaDiv) return;

    function criarMapa() {
        if (mapaInicializado) return;

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

                // 🔥 aqui resolve de vez
                map.invalidateSize();
            });

        mapaInicializado = true;
    }

    // 🔥 OBSERVA quando o elemento realmente ganha tamanho
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                criarMapa();
                resizeObserver.disconnect(); // só precisa uma vez
            }
        }
    });

    resizeObserver.observe(mapaDiv);

});
