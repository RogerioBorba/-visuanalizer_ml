<script>
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {onMount } from 'svelte';
import { goto } from '$app/navigation';
onMount( async () => {goto("/visualizador")})
</script>
   