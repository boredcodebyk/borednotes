<script lang="ts">
    export let dialogbox
</script>

<dialog bind:this={dialogbox} on:close class="dialog__box">
	<div>
    
		
		<slot name="root" />
		
		<!-- svelte-ignore a11y-autofocus -->
		<!-- <button on:click={() => dialogbox.close()}>close modal</button> -->
	
	</div>
</dialog>

