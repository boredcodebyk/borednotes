<script lang="ts">
    import { activeTab, tabs, type activeTabFormat } from "../model/store";
    import { idGenerator } from "../model/filehandle";
    import { File, FileTxt,FileMd } from "phosphor-svelte";
    export let name: string;
    export let path: string;
    function openFileInTab(filename: string, filepath: string) {
        var tab: activeTabFormat = {
            id: idGenerator(),
            filename: filename,
            path: filepath,
        };
        if ($tabs.find((e) => e.path == path)) {
            $activeTab = $tabs.find((e) => e.path == path);
        } else {
            $tabs = [...$tabs, tab];
            $activeTab = tab;
        }
        console.log($tabs);
    }

    function fileIcon(filetype: string) {
        switch (filetype) {
            case "md":
                return FileMd;
            case "txt":
                return FileTxt
            default:
                return File;
        }
    }
</script>

<button
    class="filetree__item filetree__file"
    class:filetree__file_active={$activeTab.path === path}
    on:click={() => openFileInTab(name, path)}
>
    <svelte:component this={fileIcon(name.split(".").pop())} />

    {name}
</button>
