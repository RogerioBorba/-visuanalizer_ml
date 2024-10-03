<script>
    export let header = '';
    let icon = 1
    let expanded = false
    let signal = "&plus;"
    
    let display = 'hidden'
    const isExpanded = () => {
      expanded = !expanded
      display = (expanded === true)?'block': 'hidden' 
      signal = (expanded === true)?"&minus;":"&plus;" 

    }
  </script>
  <div class="relative mt-0 mr-0  border-gray-300 border-1 focus:outline-none outline-none">
    <button class= "flex items-center border border-gray-400 bg-gray-100 hover:bg-gray-300  cursor-pointer  p-2 w-full text-justify text-gray-900 text-sm focus:outline-none outline-none" on:click={isExpanded}>
      <div class="{(icon !== null?'block':'hidden')} ml-1">
        <slot name="svg">
        </slot>
      </div>
    <div class="ml-1 Roboto md:Roboto">{header} </div>
      <div class="ml-auto text-2xl cursor-pointer">{@html signal}</div>
    </button>
    
    <div class="bg-gray-50 p-1 overflow-auto m-0 {display}">
      <slot name="content"></slot>
    </div>
</div>
  <style style lang="postcss">
    
  
  
  </style>
  