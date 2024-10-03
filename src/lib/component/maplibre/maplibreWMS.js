
/**
 * @param {maplibregl.Map} map
 * @param {string} url
 * @param {string} layerName
 */
async function addService(map, url, layerName) {
    try {
        const targetUrl = `${url}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=${layerName}&CRS=EPSG:3857&STYLES=&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}`;
        console.log("addService>>>> targetUrl: " + targetUrl);
        if (map.getLayer(layerName)) {
            map.removeSource(layerName);
            map.removeLayer(layerName);
        }
        map.addSource(layerName, {
            'type': 'raster',
            'tiles': [targetUrl],
            'tileSize': 256
        });
        
        map.addLayer({
            'id': layerName,
            'type': 'raster',
            'source': layerName,
            'paint': {}
        });
        console.log("Layer adicionado com sucesso");
    } catch (error) {
        console.log("Erro capturado: " +  error.message);
    }    

}
/**
 * @param {maplibregl.Map} map
 * @param {string} url
 * @param {string} layerName
 * @param {string} protocolServerPort
 */
export async function addWMSLayer(map, url, layerName, protocolServerPort ='http://localhost:5173') {
    try {
        await addService(map, url, layerName)
        // problema de CORS
        // Captura erros de carregamento da fonte. Infelizmente a função addSource do Map não levanta exceção para erros
        map.on('error', function(e) {
            if (e.sourceId === layerName && e.error.message == 'Failed to fetch')  {
                map.removeLayer(layerName)
                map.removeSource(layerName)
                console.log(`Erro ao carregar a camada ${e.sourceId} : ` + e.error.message);
                const targetUrl = `${protocolServerPort}/api/get-image/?url=${url}`;
                console.log("ERRO targetUrl: " + targetUrl);
                addService(map, targetUrl, layerName)
            }
                
        });
        console.log("Layer adicionado com sucesso");
    } catch (error) {
        console.log("Erro capturado: " +  error.message);
    }    
        
}

export async function removeWMSLayer(map, id) {
    if (map.getLayer(id)) {
        map.removeLayer(id);
    }
    if (map.getSource(id)) {
        map.removeSource(id);
    }
}