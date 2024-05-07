<script lang="ts">
    import type { FileEntry } from "@tauri-apps/api/fs";
    import FileItem from "./FileItem.svelte";
    export let files: FileEntry[];
    export let name;
    let expanded = false;

    function toggle() {
        expanded = !expanded;
    }
</script>

<button class="filetree__item filetree__folder" on:click={toggle}>{name}</button>

{#if expanded}
    <ul class="filetree__subcontainer">
        {#each files as entry}
            <li>
                {#if entry.children}
                    <svelte:self name={entry.name} files={entry.children} />
                {:else}
                   <FileItem name={entry.name} path={entry.path}/>
                {/if}
            </li>
        {/each}
    </ul>
{/if}
