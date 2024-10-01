<script>
 import {selectedLayers}  from '$lib/store/storeMap'
 import {flip} from 'svelte/animate';
 let hovering = false;

 const drop = (event, target) => {
    event.dataTransfer.dropEffect = 'move'; 
    const start = parseInt(event.dataTransfer.getData("text/plain"));
    const newTracklist = $selectedLayers
    console.log(start)
    console.log('target: ', target)
    if (start < target) {
      newTracklist.splice(target + 1, 0, newTracklist[start]);
      newTracklist.splice(start, 1);
    } else {
      newTracklist.splice(target, 0, newTracklist[start]);
      newTracklist.splice(start + 1, 1);
    }
    selectedLayers.set(newTracklist)
    let wmsLayer1 = $selectedLayers[start]
    for (let i = 0; i < $selectedLayers.length; i++) {
        let wmsLayer1 = $selectedLayers[i]
        wmsLayer1.sourceLayer.setZIndex(i+1)
    }
    hovering = null
  }

  const dragstart = (event, i) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    const start = i;
    event.dataTransfer.setData('text/plain', start);
  }
  
  $: if($selectedLayers){
    console.log($selectedLayers)
  }

</script>

{#each $selectedLayers as layer, index (index) }
  
    <div role= "button" tabindex="0" class= "border rounded-bl-md active:bg-slate-400 mt-1 px-1" animate:flip
    draggable={true} 
    on:dragstart={event => dragstart(event, index)}
    on:drop|preventDefault={event => drop(event, index)}
    ondragover="return false"
    on:dragenter={() => hovering = index}
    class:is-active={hovering === index}>
    {#await import(`./Selected${layer.className}.svelte`) then Module}
                  <Module.default dataLayer={layer} />
    {/await}
    </div>
{/each}    
<style>
	/*.select-layer {
        border-width: 1px;
    }
    select-layer.is-active {
        --tw-bg-opacity: 1;
        background-color: rgb(148 163 184 / var(--tw-bg-opacity));
        color: #fff;
    }*/
</style>