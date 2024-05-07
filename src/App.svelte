<script>
  import { registerAll, unregisterAll } from "@tauri-apps/api/globalShortcut";
  import CommandBox from "./lib/Commandbox.svelte";
  import Tabzone from "./lib/Tabzone.svelte";
  import { onDestroy, onMount } from "svelte";
  import { loadTheme } from "./lib/model/utils";
  import { appWindow } from "@tauri-apps/api/window";
  import Intro from "./lib/Intro.svelte";
  import { persistedState, tabs } from "./lib/model/store";
  import { readWorkspaceDir } from "./lib/model/filehandle";
  import FileList from "./lib/components/FileList.svelte";
  import FileItem from "./lib/components/FileItem.svelte";
    import { get } from "svelte/store";

  let cmdbox;

  let keypress;

  async function registerShortcuts() {
    await registerAll(["CommandOrControl+Shift+P"], (shortcut) => {
      cmdbox.showModal();
    });
  }

  onMount(async () => {
    console.log("registered shortcut");
    await registerAll(["CommandOrControl+Shift+P"], (shortcut) => {
      cmdbox.showModal();
      console.log("open command box");
    });
  });

  onDestroy(async () => {
    await unregisterAll();
  });

  function getKeypress(event) {
    const alphabetRegexp = new RegExp("^[a-z]");

    if (event.keyCode == 9) event.preventDefault();
    event.key.toString().match(alphabetRegexp)
      ? (keypress.innerHTML = event.key.toString().toUpperCase())
      : (keypress.innerHTML = event.key.toString());
  }

  let bgContainer = "#3bdbe5";
  let bgSideBar = "#FF3423";
  // let styles = {
  // 	'note-bg-color': '#f4ed2a',
  // 	'note-color': '#FF5555',
  // 	'bg': '#AAAAAA',
  // };

  // $: cssVarStyles = Object.entries(styles)
  // 	.map(([key, value]) => `--${key}:${value}`)
  // 	.join(';');

  $: cssVarStyles = loadTheme();
</script>

<div style={cssVarStyles}>
  <nav data-tauri-drag-region class="main__windowtitlebar">
    <div data-tauri-drag-region class="titlebar__title"></div>
    <div class="titlebar__action">
      <button
        class="icon__button minimize__button"
        on:click={() => appWindow.minimize()}
      >
        <svg
          width="48"
          height="48"
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
          width="48"
          height="48"
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
          width="48"
          height="48"
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

  <main
    class="main__container {!$persistedState.isSidepaneOpen
      ? 'main__container__fillwidth'
      : ''}"
  >
    {#if get(persistedState).workspace.active}
      {#if get(tabs).length !== 0}
        <Tabzone />
      {:else}
        <Intro />
      {/if}
    {:else}
      <Intro />
    {/if}
  </main>

  <aside
    class="main__sidepane {!$persistedState.isSidepaneOpen
      ? 'main__sidepane__hidden'
      : ''}"
  >
    <h2 style="padding-left: 16px;">bored notes</h2>
    <ul class="filetree__container">
      {#if $persistedState.workspace.active}
        {#await readWorkspaceDir($persistedState.workspace.path)}
          <p>loading</p>
        {:then files}
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
        {/await}
      {/if}
    </ul>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="draghandler draghandler-right"></div>
  </aside>

  <aside class="main__sideactionbar">
    {#if $persistedState.workspace.active}
      <button
        class="icon__button icon__button_leftborder {$persistedState.isSidepaneOpen
          ? 'icon__button_active_leftborder'
          : ''}"
        on:click={() => {
          $persistedState.isSidepaneOpen
            ? ($persistedState.isSidepaneOpen = false)
            : ($persistedState.isSidepaneOpen = true);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </button>
    {/if}

    <button
      class="icon__button icon__button_leftborder"
      on:click={() => cmdbox.showModal()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
    </button>
    <button
      class="icon__button icon__button_leftborder"
      on:click={() => cmdbox.showModal()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    </button>
  </aside>

  <footer class="main__footer">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <small bind:this={keypress}></small>
  </footer>

  <CommandBox bind:cmdbox />
</div>
<svelte:window on:keydown={getKeypress} />
