<script lang="ts">
    import { activeTab, tabs, type activeTabFormat } from "../model/store";
    import { idGenerator } from "../model/filehandle";
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
            $tabs.push(tab);
            $activeTab = tab;
        }
    }
</script>

<button
    class="filetree__item filetree__file"
    on:click={() => openFileInTab(name, path)}>{name}</button
>
