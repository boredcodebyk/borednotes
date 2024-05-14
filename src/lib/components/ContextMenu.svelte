<script lang="ts">
    import {
        contextMenuSize,
        contextMenuList,
        mousePosition,
        showContextMenu,
    } from "../model/store";
    import type { ContextMenuItem } from "../model/utils";
    

    $: showMenu = $showContextMenu;

    function getContextMenuDimension(node) {
        let height = node.offsetHeight;
        let width = node.offsetWidth;
        $contextMenuSize = {
            h: height,
            w: width,
        };
    }
</script>

{#if showMenu}
    <div
        class="context__menu"
        use:getContextMenuDimension
        style="position: fixed; top:{$mousePosition.y}px; left:{$mousePosition.x}px"
    >
        <ul>
            {#each $contextMenuList as contextMenuItem, index}
                <li>{contextMenuItem.name}</li>
            {/each}
        </ul>
    </div>
{/if}

<style>
    .context__menu {
        background-color: var(--surfaceContainerHighest);
        color: var(--onSurface);
        border: 1px solid var(--outline);
        min-width: 18em;
        padding: 0;
        margin: 0;
    }
</style>
