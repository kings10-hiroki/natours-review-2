export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiOGhpcm9wb24iLCJhIjoiY2toYjdnbnVyMDF3cDMycXR4aWVqZjdsMSJ9.0MX3xDcJQFvoMftxRL8N_Q';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/8hiropon/ckfvu4ror3ad319n98kvu72r6',
        // center: [-118.6919161, 34.0207305],
        // zoom: 7,
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        const el = document.createElement('div');
        el.className = 'marker';

        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 200,
            left: 100,
            right: 100
        }
    });
}