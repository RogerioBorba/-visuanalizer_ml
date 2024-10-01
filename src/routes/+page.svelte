<script>
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { onDestroy, onMount } from 'svelte';
import {styleOSM} from "$lib/store/storeMapLibreStyle";
    /**
     * @type {maplibregl.Map}
     */
let map;
onMount( async () => {
    
    // Initialise the map
    map = new maplibregl.Map({
        container: 'map',
        style: $styleOSM,
        center: [-40, -20],
        zoom: 3
    });

    // Add the navigation control
    map.addControl(new maplibregl.NavigationControl());
}) 
    async function addWMSLayer() {
        let url = "https://geoservicos.inde.gov.br/geoserver/BNDES/wms";
        let layerName = "BNDES:AP_2016";
        map.addSource('wms-test-source', {
            'type': 'raster',
            // use the tiles option to specify a WMS tile source URL
            // https://maplibre.org/maplibre-gl-js-docs/style-spec/sources/
            'tiles': [
                `${url}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=${layerName}&CRS=EPSG:3857&STYLES=&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}`
            ],
            'tileSize': 256
        });
        map.addLayer({
          'id': 'wms-test-layer',
          'type': 'raster',
          'source': 'wms-test-source',
          'paint': {}
        });
    }
</script>

    <button on:click={addWMSLayer}>Add</button>
    <div id="map" class="w-full h-screen bg-blue-200">
    </div>
    
