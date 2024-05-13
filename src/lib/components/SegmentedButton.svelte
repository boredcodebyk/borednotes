<script lang="ts">
    export let icon: SVGElement;
    export let func: void;
</script>

<button class="icon__button" on:click={()=>func}>
    {icon}
</button>

