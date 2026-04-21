document.addEventListener("DOMContentLoaded", () => {

    // 📍 Inicializa o mapa imediatamente
    const map = L.map('mapa').setView([-8.9, 13.25], 12);

    // 🗺️ Camada base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // 📌 Coordenadas
    const start = [-8.968213, 13.471105]; // KM30
    const end   = [-8.828140, 13.243203]; // 1º de Maio

    // 📍 Marcadores
    L.marker(start).addTo(map).bindPopup("KM 30");
    L.marker(end).addTo(map).bindPopup("1º de Maio");

    // 🔗 Rota OSRM
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

            // 🔥 CORREÇÃO PRINCIPAL
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        })
        .catch(err => console.error("Erro ao carregar rota:", err));

    // 🔥 Corrige quando a página muda layout (scroll, etc)
    window.addEventListener("load", () => {
        setTimeout(() => map.invalidateSize(), 200);
    });

    window.addEventListener("resize", () => {
        map.invalidateSize();
    });

});
