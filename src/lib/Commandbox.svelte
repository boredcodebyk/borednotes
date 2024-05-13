<script lang="ts">
    import CreateWorkspaceDialog from "./CreateWorkspaceDialog.svelte";
    import DialogBox from "./components/DialogBox.svelte";
    import { openWorkspace, selectRootDir } from "./model/filehandle";
    import { activeTab, persistedState, tabs, type activeTabFormat } from "./model/store";
    import { commandList } from "./model/utils";

    export let cmdbox;
    let workspaceDialog;
    let filteredList = [];
    let searchCmdName;
    function searchCmd() {
        return (filteredList = commandList.filter((cmd) => {
            return cmd.name.toLowerCase().includes(searchCmdName.toLowerCase());
        }));
    }
    let newIndex = 0;

    function createWorkspaceDialog() {
        workspaceDialog.showModal();
        console.log("openssss");
    }

    const cmdFunc = [null, openWorkspace()];

    async function _open() {
        let rootPath = await selectRootDir();
        if (rootPath !== null) {
            var workspaceState = {
                active: true,
                path: rootPath.toString(),
            };
            $persistedState.workspace = workspaceState;
            $persistedState.isSidepaneOpen = true;
        }
    }

    function closeWorkspace() {
        $activeTab = <activeTabFormat>{}
        $tabs = <activeTabFormat[]>[];
        $persistedState.isSidepaneOpen = false;
        $persistedState.workspace.active = false;
        $persistedState.workspace.path = "";
    }

    function handleKeydown(e) {
        if (e.keyCode !== 38 && e.keyCode !== 40) return;
        const current = document.activeElement;
        const items = [
            document.querySelector(".command__search"),
            ...document.querySelectorAll(".command__list_item"),
        ];
        const currentIndex = items.indexOf(current);

        if (currentIndex === -1) {
            newIndex = 0;
        } else {
            if (e.keyCode === 38) {
                newIndex = (currentIndex + items.length - 1) % items.length;
            } else {
                newIndex = (currentIndex + 1) % items.length;
            }
        }
        // @ts-ignore
        current.blur();
        // @ts-ignore
        items[newIndex].focus();
    }
</script>

<CreateWorkspaceDialog bind:workspaceDialog />

<DialogBox bind:dialogbox={cmdbox}>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div slot="root" on:keydown|preventDefault={handleKeydown}>
        <div class="command__search_container">
            <!-- svelte-ignore a11y-autofocus -->
            <input
                type="text"
                class="command__search"
                autofocus
                placeholder="Search command"
                bind:value={searchCmdName}
                on:input={searchCmd}
            />
        </div>

        <ul class="command__list">
            {#if searchCmdName && filteredList.length === 0}
                Not found
            {:else if filteredList.length > 0}
                {#each filteredList as cmd, index}
                    <button
                        class="command__list_item"
                        class:command__list_item_selected={index ===
                            newIndex - 1}
                        on:click={() => {
                            switch (index) {
                                case 0:
                                    index === 0
                                        ? workspaceDialog.showModal()
                                        : cmdFunc[index];
                                    break;
                                case 1:
                                    _open();
                                    break;
                                    case 2:
                                        closeWorkspace();
                                        break;
                                default:
                                    break;
                            }
                            cmdbox.close();
                        }}
                    >
                        {cmd.name}
                    </button>
                {/each}
            {:else}
                {#each commandList as cmd, index}
                    <button
                        class="command__list_item"
                        class:command__list_item_selected={index ===
                            newIndex - 1}
                        on:click={() => {
                            switch (index) {
                                case 0:
                                    index === 0
                                        ? workspaceDialog.showModal()
                                        : cmdFunc[index];

                                    break;
                                case 1:
                                    _open();
                                    break;
                                    case 2:
                                        closeWorkspace();
                                        break;
                                default:
                                    break;
                            }
                            cmdbox.close();
                        }}
                    >
                        {cmd.name}
                    </button>
                {/each}
            {/if}
        </ul>
    </div>
</DialogBox>
