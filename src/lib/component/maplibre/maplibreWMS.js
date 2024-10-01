/**
 * @param {maplibregl.Map} map
 * @param {string} url
 * @param {string} layerName
 */
export async function addWMSLayer(map, url, layerName) {
    //let url = "https://geoservicos.inde.gov.br/geoserver/BNDES/wms";
    //let layerName = "BNDES:AP_2016";
    map.addSource(layerName, {
        'type': 'raster',
        // use the tiles option to specify a WMS tile source URL
        // https://maplibre.org/maplibre-gl-js-docs/style-spec/sources/
        'tiles': [
            `${url}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=${layerName}&CRS=EPSG:3857&STYLES=&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}`
        ],
        'tileSize': 256
    });
    map.addLayer({
      'id': layerName,
      'type': 'raster',
      'source': layerName,
      'paint': {}
    });
}