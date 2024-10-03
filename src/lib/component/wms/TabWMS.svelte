<script>
    import {  Tabs, TabItem} from 'flowbite-svelte';
    import BaseWMS from './BaseWMS.svelte'  
	
</script>
    
<Tabs style="underline" >
    <TabItem open title='Por instituição'>
        <BaseWMS></BaseWMS>    
    </TabItem>
    <TabItem title='Pesquisa avançada'>
        
    </TabItem>
    
</Tabs>