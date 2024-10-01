<script>

    import { selectedLayers, map } from '$lib/store/storeMap';
    import { removeWMSLayer } from '$lib/component/maplibre/maplibreWMS'
    import { onMount } from 'svelte';
    
    export let dataLayer;
    let hidden ='hidden';
    let linkLegenda = '';

  
    onMount( async () => {
    })  

    function btnClearClicked() {
        if (!dataLayer)
            return 
        $selectedLayers = $selectedLayers.filter(t => t.oid !== dataLayer.oid);
        //dataLayer.layer.map.removeLayer(dataLayer.layer);
        //$removedLayers = [...$removedLayers, dataLayer];
        
        removeWMSLayer($map, dataLayer.name())
        
    }
    function getLegendGraphicURLByLink() {
        
        let url = dataLayer.dataLayerCapability.link.substring(0, dataLayer.wmsLayerCapability.link.indexOf('?') + 1)
        return `${url}SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${dataLayer.name()}`
    }
    function btnLegendClicked() {
        let styles = dataLayer.styles();
        if (styles && styles.length > 0)
            linkLegenda = styles[0].legendGraphicURL;
        else {
            if (dataLayer.wmsLayerCapability.link) {
            
                linkLegenda = getLegendGraphicURLByLink()
                console.log(linkLegenda)
            }
                
        }
        hidden = (hidden == 'hidden')?'': 'hidden'        
    }
    function errorCallback() {
        alert(`O endereço da legenda não foi encontrado: ${linkLegenda}`)
    }
    
    $:{
        if(dataLayer){
            console.log(dataLayer.className)
        }
    }
        
</script>
    <div class="flex mt-1 relative text-gray-700">
        <p class="mt-1 flex-grow text-grey-darkest hover:bg-red truncate text-left text-xs" title="{`${dataLayer.title()}`}">{`${dataLayer.title()}`}</p>
            <button class="mb-4 focus:outline-none bg-grey-light hover:bg-grey text-grey-darkest font-bold py-1 px-1 rounded inline-flex items-center hover:bg-gray-200" on:click|preventDefault={btnLegendClicked} title="Legenda">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="cyan" viewBox="0 0 22 22" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>    
            </button>  
        
        <button class="mb-4 focus:outline-none bg-grey-light hover:bg-grey text-grey-darkest font-bold py-1 px-1 rounded inline-flex items-center hover:bg-gray-200" on:click|stopPropagation={btnClearClicked} title="Remover camada">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
        </button>
    </div>
    <div id="popup-modal" tabindex="-1" class="{hidden} overflow-y-auto overflow-x-hidden relative top-0 right-0 left-40 z-50 md:inset-0 h-modal md:h-full">
        <div class="relative p-4 w-full max-w-md h-full md:h-auto">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button type="button" on:click={btnLegendClicked} class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal">
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span class="sr-only">Close modal</span>
                </button>
                <div class="p-6 text-center">
                    <img src={linkLegenda}>                               
                </div>
            </div>
        </div>
    </div>