<script>
    import { readWorkspaceDir } from "./model/filehandle";
    import { fileDir, persistedState } from "./model/store";
    import FileItem from "./components/FileItem.svelte";
    import FileList from "./components/FileList.svelte";

    $: files = $fileDir
</script>

<ul class="filetree__container">
    {#if $persistedState.workspace.active}
        {#each files as file}
            {#if file.children}
                <li>
                    <FileList name={file.name} files={file.children} />
                </li>
            {:else}
                <li>
                    <FileItem name={file.name} path={file.path} />
                </li>
            {/if}
        {/each}
    {/if}
</ul>
