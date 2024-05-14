<script>
    import { appWindow } from "@tauri-apps/api/window";
    import { activeTab } from "./model/store";
</script>

<nav data-tauri-drag-region class="main__windowtitlebar">
    <div data-tauri-drag-region class="titlebar__title">
        bored notes {$activeTab.filename !== "" ||
        $activeTab.filename !== undefined
            ? `- ${$activeTab.filename}`
            : ""}
    </div>
    <div class="titlebar__action">
        <button
            class="icon__button minimize__button"
            on:click={() => appWindow.minimize()}
        >
            <svg
                width="1em"
                height="1em"
                viewBox="0 0 48 48"
                version="1.1"
                id="close_icon"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                    id="minimize__icon"
                    width="32"
                    height="4"
                    x="-40"
                    y="-26"
                    transform="scale(-1)"
                />
            </svg>
        </button>
        <button
            class="icon__button maximize__button"
            on:click={() => appWindow.toggleMaximize()}
        >
            <svg
                width="1em"
                height="1em"
                viewBox="0 0 48 48"
                version="1.1"
                id="close_icon"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M 8,8 V 40 H 40 V 8 Z m 4,4 H 36 V 36 H 12 Z"
                    id="maximize__restore__icon"
                /></svg
            >
        </button>
        <button
            class="icon__button close__button"
            on:click={() => appWindow.close()}
        >
            <svg
                width="1em"
                height="1em"
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
            >
        </button>
    </div>
</nav>

<style>
    .main__windowtitlebar {
        width: 100%;
        height: 2.4em;
        display: flex;
        justify-content: space-between;
        top: 0;
        left: 0;
        position: fixed;
        background-color: var(--surfaceContainerHigh, #1a1a1a);
        border-bottom: 1px solid var(--outlineVariant);
        z-index: 30;
    }

    .titlebar__title {
        display: flex;
        font-size: 0.85em;
        align-items: center;
        padding-left: 2.4em;
        color: var(--onSurface);
    }

    .titlebar__action {
        display: flex;
        top: 0;
        right: 0;
        height: 2.4em;
    }

    .close__button,
    .maximize__button,
    .minimize__button {
        color: var(--onSurface);
        display: block;
        height: 100%;
        width: 2.8em;
        display: flex;
        padding: 12px;
        border-left: 1px solid transparent !important;
        border-right: 1px solid transparent !important;
        align-items: center;
        justify-content: center;
    }

    .close__button:hover {
        background-color: var(--error);
        color: var(--onError);
        border-left: 1px solid var(--outline);
        border-right: 1px solid var(--outline);
    }

    .minimize__button:hover {
        background-color: var(--tertiaryContainer);
        color: var(--onTertiaryContainer);
        border-left: 1px solid var(--outline);
        border-right: 1px solid var(--outline);
    }

    .maximize__button:hover {
        background-color: var(--tertiaryContainer);
        color: var(--onTertiaryContainer);
        border-left: 1px solid var(--outline);
        border-right: 1px solid var(--outline);
    }
</style>
