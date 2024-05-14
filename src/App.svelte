<script lang="ts">
  import { registerAll, unregisterAll } from "@tauri-apps/api/globalShortcut";
  import CommandBox from "./lib/Commandbox.svelte";
  import Tabzone from "./lib/Tabzone.svelte";
  import { FilePlus, FolderPlus, GearSix, ListDashes, Terminal, TerminalWindow } from "phosphor-svelte";
  import { onDestroy, onMount } from "svelte";
  import { loadTheme } from "./lib/model/utils";
  import { appWindow } from "@tauri-apps/api/window";
  import Intro from "./lib/Intro.svelte";
  import {
    activeTab,
    fileDir,
    persistedState,
    tabs,
    type activeTabFormat,
  } from "./lib/model/store";
  import {
    idGenerator,
    newMarkdownFile,
    readWorkspaceDir,
  } from "./lib/model/filehandle";
  import FileTree from "./lib/FileTree.svelte";
  import TitleBar from "./lib/TitleBar.svelte";

  $: workspaceTabs = $tabs;

  let cmdbox;

  let keypress;

  async function registerShortcuts() {
    await registerAll(["CommandOrControl+Shift+P"], (shortcut) => {
      cmdbox.showModal();
    });
  }

  onMount(() => {
    if ($persistedState.workspace.active) {
      readWorkspaceDir($persistedState.workspace.path)
    }
    console.log("registered shortcut");
    setTimeout(() => {
      appWindow.show();
    }, 3000);
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

  function newFile() {
    newMarkdownFile($persistedState.workspace.path).then((value) => {
      var newActivetab: activeTabFormat = {
        id: idGenerator(),
        filename: value.filename,
        path: value.path,
      };
      $tabs = [...$tabs, newActivetab];
      $activeTab = newActivetab;
    readWorkspaceDir($persistedState.workspace.path);
    });
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
  <TitleBar />

  <main
    class="main__container {!$persistedState.isSidepaneOpen
      ? 'main__container__fillwidth'
      : ''}"
  >
    {#if $persistedState.workspace.active}
      {#if workspaceTabs.length !== 0}
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

    <div class="segmented__icon__button">
      <button class="icon__button" on:click={newFile}>
        <FilePlus/>
      </button>
      <button class="icon__button">
        <FolderPlus/>
      </button>
    </div>
    <FileTree />

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
        <ListDashes/>
      </button>
    {/if}

    <button
      class="icon__button icon__button_leftborder"
      on:click={() => cmdbox.showModal()}
    >
      <TerminalWindow/>
    </button>
    <button
      class="icon__button icon__button_leftborder"
      on:click={() => cmdbox.showModal()}
    >
      <GearSix/>
      
    </button>
  </aside>

  <footer class="main__footer">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <small bind:this={keypress}></small>
  </footer>

  <CommandBox bind:cmdbox />
</div>
<svelte:window on:keydown={getKeypress} />
