import { open, save } from "@tauri-apps/api/dialog";
import { createDir, exists, readDir, writeTextFile } from "@tauri-apps/api/fs"
import { get } from "svelte/store";
import { watch } from "tauri-plugin-fs-watch-api";
import { fileDir, persistedState } from "./store";

export async function newWorkspace(path: string) {
    console.log("New Workspace");
    try {
        await createDir(path, { recursive: true })
    } catch (error) {
        console.log(error)
    }
}

export function openWorkspace() {
    console.log("Open Workspace")
}

export async function newMarkdownFile(path: string) {
    var filename = "Untitled";
    var copyNumber = 1;
    while (await exists(`${path}/${filename} ${copyNumber}.md`)) {
        copyNumber += 1;
    }
    try {
        await writeTextFile(`${path}/${filename} ${copyNumber}.md`, "");
        return {filename: `${filename} ${copyNumber}.md`,path:`${path}/${filename} ${copyNumber}.md`};
    } catch (error) {
        console.log(error);
    }
}

export function saveFile(path: string, content: string) {
    writeTextFile(path, content).catch((e) => console.log(e));
}

export async function selectRootDir() {
    return await open({
        directory: true,
        multiple: false,
    })
}

export async function readWorkspaceDir(path: string) {
    const entries = await readDir(path, { recursive: true });
    fileDir.set(entries);
}

interface workspaceConfig {
    id: string,
    name: string,
    tabs?: workspaceTab[],
    files?: workspaceFile[]
}

interface workspaceTab {
    id: string,
    filename: string,
    type: string,
}

interface workspaceFile {
    id: string,
    filename: string,
    type: string,
    path?: string,
}


// export async function configFile({ path, name }) {
//     if (await exists(`${path}/.borednotes/workspace.json`)) {
//         // Handle Update
//     } else {
//         // Create New
//         try {
//             await writeTextFile(`${path}/.borednotes/workspace.json`, JSON.stringify(config));
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }

export function idGenerator() {
    var chars = "abcdefghijklmnopqrstuvwxyz01234567899";
    var id = "";
    for (let i = 0; i <= 12; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

async function watcher() {
    let watchie = await watch(
        get(persistedState).workspace.path,
        (event) => {
            console.log(event)
        },
        { recursive: true },
    );
}