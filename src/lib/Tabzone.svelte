<script>
    import { activeTab, tabs, persistedState } from "./model/store";
    import EditorContainer from "./EditorContainer.svelte";
    import { get } from "svelte/store";
    import { readWorkspaceDir } from "./model/filehandle";
    function changeTab(value) {
        $activeTab = value;
        readWorkspaceDir($persistedState.workspace.path);
    }

    /**
     * @param {KeyboardEvent} event
     */
    function switchTab(event) {
        if (event.ctrlKey && event.key === "Tab") {
            var posLoc = $tabs.length - 1;
            var activeTabIndex = $tabs.findIndex((e) => e.id == $activeTab.id);
            if (activeTabIndex === posLoc) {
                $activeTab = $tabs[0];
            } else {
                $activeTab = $tabs[activeTabIndex + 1];
            }
        }
        if (event.ctrlKey && event.shiftKey && event.key === "Tab") {
            console.log("back");
            var posLoc = $tabs.length - 1;
            var activeTabIndex = $tabs.findIndex((e) => e.id == $activeTab.id);
            if (activeTabIndex === 0) {
                $activeTab = $tabs[posLoc];
            } else {
                $activeTab = $tabs[activeTabIndex - 1];
            }
        }
        readWorkspaceDir($persistedState.workspace.path);
    }

    function closeTab(tabIndex) {
        var closeIndex = $tabs.findIndex((e) => e.id == $tabs[tabIndex].id);
        var allTabs = $tabs;
        if (closeIndex > -1) {
            if (closeIndex == $tabs.length - 1) {
                if ($tabs.length === 1) {
                    $activeTab = { id: "", filename: "", path: "" };
                    $tabs = [];
                } else {
                    $activeTab = allTabs[allTabs.length - 1 - 1];
                    allTabs.splice(closeIndex, 1);
                    $tabs = allTabs;
                }
            } else {
                $activeTab = allTabs[closeIndex + 1];
                allTabs.splice(closeIndex, 1);
                $tabs = allTabs;
            }
        }
        readWorkspaceDir($persistedState.workspace.path);
    }

    $: openedtabs = $tabs;
    $: currentActiveTab = $activeTab;
</script>

<div class="tabzone__container">
    <ul class="tabzone__tabbar">
        {#each openedtabs as tab, index}
            <li>
                <button
                    class="tab__button"
                    class:active__tab__button={currentActiveTab.path ===
                        tab.path}
                    on:click={() => changeTab(tab)}
                    >{tab.filename}
                    <button
                        class="tabclose"
                        class:tabclose__hide={!(
                            currentActiveTab.path === tab.path
                        )}
                        on:click={() => closeTab(index)}
                        ><svg
                            width="16"
                            height="16"
                            viewBox="0 0 48 48"
                            version="1.1"
                            id="close_icon"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M 11.199558,8 8,11.199558 20.800442,24 8,36.800442 11.199558,40 24,27.199558 36.800442,40 40,36.800442 27.199558,24 40,11.199558 36.800442,8 24,20.800442 Z"
                                id="close__icon"
                            >
                            </path></svg
                        ></button
                    >
                </button>
            </li>
        {/each}
    </ul>
    <div class="tabzone__tabviewcontainer">
        {#each openedtabs as tab, index}
            {#if currentActiveTab.id === tab.id}
                <EditorContainer />
            {/if}
        {/each}
    </div>
</div>

<svelte:window on:keydown={switchTab} />

<style>
    .tabzone__container {
        height: 100%;
        width: 100%;
    }
    .tabzone__tabbar {
        height: 2.4em;
        top: 0;
        position: relative;
        background-color: var(--surfaceContainer);
        width: 100%;
        border-bottom: 1px solid var(--outlineVariant);
        display: flex;
        flex-direction: row;
        overflow: scroll;
        white-space: nowrap;
        margin: 0;
        list-style: none;
        margin-block: 0;
        padding: 0;
        z-index: 5;
    }
    .tabzone__tabbar > li {
        background-color: transparent;
        min-width: 200px;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
    }
    .tabzone__tabbar > li > .tab__button {
        background-color: var(--surfaceContainer);
        border-right: 1px solid var(--outlineVariant);
        color: var(--onSurfaceVariant);
        width: 100%;
        text-align: left;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
    }

    .active__tab__button {
        background-color: var(--secondaryContainer) !important;
        z-index: 6;
    }
    .tabzone__tabviewcontainer {
        background-color: var(--surfaceContainerHigh) !important;
        width: 100%;
        height: calc(100dvh - 48px - 48px);
    }

    .tabclose {
        padding: 2px;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        color: var(--onSecondaryContainer);
    }

    .tabclose:hover {
        background-color: var(--surfaceContainer);
    }

    .tabclose__hide {
        visibility: hidden;
    }

    .tabclose:hover .tabclose__hide {
        visibility: visible;
    }
</style>
