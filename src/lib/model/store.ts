import type { FileEntry } from '@tauri-apps/api/fs';
import { persisted } from 'svelte-persisted-store'
import { writable } from 'svelte/store';
import type { ContextMenuItem } from './utils';

export const showContextMenu = writable(false);
export const mousePosition = writable({ x: 0, y: 0 });
export const windowsize = writable({ w: 0, h: 0 });
export const contextMenuSize = writable({w: 0, h: 0});
export const contextMenuList = writable<ContextMenuItem[]>([])
export interface activeTabFormat {
    id: string,
    path: string,
    filename: string,
}

export const preferences = persisted('preferences', {
    ui: {
        theme: {
            name: "material-theme",
            path: "",
            mode: "dark"
        },
        pane: '50%',
    }
});

export const persistedState = persisted('persistedState', {
    isSidepaneOpen: false,
    workspace: {
        active: false,
        path: ""
    },
});

export const activeTab = persisted('activeTab', <activeTabFormat>{});
export const tabs = persisted('tabs', <activeTabFormat[]>[]);

export const fileDir = persisted('fileDir',<FileEntry[]>[]);