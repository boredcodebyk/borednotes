<script>
    import { activeTab, tabs } from "./model/store";
    import EditorContainer from "./EditorContainer.svelte";
    import { get } from "svelte/store";
    function changeTab(value) {
        $activeTab = value;
    }
</script>

<div class="tabzone__container">
    <ul class="tabzone__tabbar">
        {#each get(tabs) as tab, index}
            <li>
                <button
                    class="tab__button"
                    class:active__tab__button={$activeTab.path === tab.path}
                    on:click={()=>changeTab(tab)}
                    >{tab.filename}
                    <span
                        class="tabclose"
                        class:tabclose__hide={!($activeTab.path === tab.path)}
                        
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
                        ></span
                    >
                </button>
            </li>
        {/each}
    </ul>
    <div class="tabzone__tabviewcontainer">
        {#each get(tabs) as tab, index}
            {#if $activeTab.id === tab.id}
                <EditorContainer />
            {/if}
        {/each}
    </div>
</div>

<style>
    .tabzone__container {
        height: 100%;
        width: 100%;
    }
    .tabzone__tabbar {
        height: 48px;
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
        display: inline;
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
    }

    .tabclose:hover {
        background-color: var(--surfaceContainer);
    }

    .tabclose__hide {
        visibility: hidden;
    }

    .tabclose__hide:hover {
        visibility: visible;
    }
</style>
