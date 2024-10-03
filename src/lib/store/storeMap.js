import { writable } from "svelte/store";
export let map = writable(null);
export let selectedLayers =  writable([]);