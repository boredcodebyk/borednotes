import { persisted } from 'svelte-persisted-store'

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
    isSidepaneOpen: true,
    workspace: {
        active: false,
        path: ""
    },
});

export const activeTab = persisted('activeTab', <activeTabFormat>{});
export const tabs = persisted('tabs', <activeTabFormat[]>[]);