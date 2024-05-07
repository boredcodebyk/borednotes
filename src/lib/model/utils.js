import { newWorkspace, openWorkspace } from "./filehandle";
import theme from "./defaultTheme.json";

export function loadTheme() {
    let cssVarStyles = Object.entries(theme.schemes["dark"])
        .map(([key, value]) => `--${key}:${value}`)
        .join(';');
    return cssVarStyles;
}

export const commandList = [
    {
        id: 1,
        name: "Create New Workspace",
        shortcut: "CommandOrControl+Shift+N",
    },
    {
        id: 2,
        name: "Open Workspace",
        shortcut: "CommandOrControl+O",
    },
    {
        id: 3,
        name: "Close Workspace",
        shortcut: "",
    }
]
