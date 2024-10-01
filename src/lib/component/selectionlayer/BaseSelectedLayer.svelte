<script>
 import {selectedLayers, map}  from '$lib/store/storeMap'
 //import {flip} from 'svelte/animate';
 let hovering = false;

 const drop = (event, target) => {
    //event.dataTransfer.dropEffect = 'move'; 
    const start = parseInt(event.dataTransfer.getData("text/plain"));
    let newTracklist = $selectedLayers
    if (start < target) {
      newTracklist.splice(target + 1, 0, newTracklist[start]);
      newTracklist.splice(start, 1);
    } else {
      newTracklist.splice(target, 0, newTracklist[start]);
      newTracklist.splice(start + 1, 1);
    }

    selectedLayers.set(newTracklist)
    const layers = $map.getStyle().layers;
    const layer_names = [layers[0].id, ...$selectedLayers.map(l=> l.name())];
    layer_names.forEach((layerId) => { $map.moveLayer(layerId)});
    hovering = null
  }

  const dragstart = (event, i) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    const start = i;
    event.dataTransfer.setData('text/plain', start);
  }

</script>

{#each $selectedLayers as layer, index (index) }
  
    <div role= "button" tabindex="0" class= "border rounded-bl-md active:bg-slate-400 mt-1 px-1" 
    draggable={true} 
    on:dragstart={event => dragstart(event, index)}
    on:drop|preventDefault={event => drop(event, index)}
    ondragover="return false"
    on:dragenter={() => hovering = index}
    >
    {#await import(`./Selected${layer.className}.svelte`) then Module}
                  <Module.default dataLayer={layer} />
    {/await}
    </div>
{/each}    
