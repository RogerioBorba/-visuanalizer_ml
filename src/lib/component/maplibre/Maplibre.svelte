<script>
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {onMount } from 'svelte';
import {styleOSM} from "$lib/store/storeMapLibreStyle";
import {map} from "$lib/store/storeMap";
export let idHtml= 'map';

onMount( async () => {
    
    /*** 
     * @type {maplibregl.Map} 
     * */
     const aMap = new maplibregl.Map({
        container: idHtml,
        style: $styleOSM,
        center: [-55, -15],
        zoom: 3
    });
    map.set(aMap);
    // Add the navigation control
    //$map.addControl(new maplibregl.NavigationControl());
}) 
</script>
<div id="map" class="w-full h-screen bg-blue-200">
</div>