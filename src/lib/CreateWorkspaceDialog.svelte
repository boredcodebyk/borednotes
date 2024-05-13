<script lang="ts">
    import DialogBox from "./components/DialogBox.svelte";
    import {
    idGenerator,
        newMarkdownFile,
        newWorkspace,
        readWorkspaceDir,
        selectRootDir,
        //configFile,
    } from "./model/filehandle";
    import { persistedState, activeTab, tabs, type activeTabFormat } from "./model/store";

    export let workspaceDialog: HTMLDialogElement;

    let workspaceName = "";
    let workspaceRootPath;
    let workspacePath = "";

    async function getRootPath() {
        let rootPath = await selectRootDir();
        if (rootPath !== null) {
            workspacePath = `${rootPath.toString()}/${workspaceName}`;
        }
    }

    async function _save() {
        await newWorkspace(workspacePath);
        newMarkdownFile(workspacePath).then((value) => {
            var newActivetab: activeTabFormat = {
                id: idGenerator(),
                filename: value.filename,
                path: value.path,
            };
            $tabs = [newActivetab];
            $activeTab = newActivetab;
        });
        //await configFile({ path: workspacePath, name: workspaceName });
        workspaceDialog.close();
        $persistedState.workspace = { active: true, path: workspacePath };
        $persistedState.isSidepaneOpen = true;

        readWorkspaceDir(workspacePath);
    }
</script>

<DialogBox bind:dialogbox={workspaceDialog}>
    <div slot="root">
        <div class="workspacedialog__topbar">
            <h3>New Workspace</h3>
            <button
                class="workspacedialog__topbar__close"
                on:click={() => workspaceDialog.close()}
            >
                <svg
                    width="24"
                    height="24"
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
        <div class="workspacedialog__container">
            <input
                type="text"
                name="WorkspaceName"
                class="workspacename__input"
                placeholder="Workspace Name (required)"
                required
                bind:value={workspaceName}
            />
            <button style="width: 100%;" on:click={getRootPath}
                >Select Workspace Location</button
            >
            <p>Workspace Path: {workspacePath}</p>
        </div>
        <div class="workspacedialog__footer">
            <button
                on:click={_save}
                disabled={workspaceName === "" && workspacePath === ""}
                >Save</button
            >
        </div>
    </div>
</DialogBox>

<style>
    .workspacedialog__topbar {
        position: relative;
        top: 0;
        height: 48px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .workspacedialog__topbar__close {
        background-color: transparent;
        color: var(--onSurface);
        width: 48px;
        height: 48px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .workspacedialog__topbar__close:hover {
        background-color: var(--surfaceContainerLow);
    }
    .workspacedialog__container {
        height: calc(100% - 48px);
    }
    .workspacename__input {
        width: 100%;
        margin: 12px 0;
    }
    .workspacedialog__footer {
        position: absolute;
        bottom: 24px;
        right: 12px;
        height: 48px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: right;
    }
</style>
