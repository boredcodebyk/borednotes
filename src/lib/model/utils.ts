import { newWorkspace, openWorkspace } from "./filehandle";
import theme from "./defaultTheme.json";
import type { SvelteComponent } from "svelte";
import { contextMenuList, contextMenuSize, mousePosition, showContextMenu, windowsize } from "./store";
import { get } from "svelte/store";

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

export interface ContextMenuItem {
    name: string,
    icon?: SvelteComponent,
    method: void,
}

export function rightClick(event: MouseEvent, container: HTMLElement, menuList: ContextMenuItem[]) {
    contextMenuList.set(menuList);
    showContextMenu.set(true);
    let pos = get(mousePosition);
    let menu = get(contextMenuSize);
    console.log(event)
    windowsize.set({
        w: container.clientWidth,
        h: container.clientHeight
    });
    let window = get(windowsize);
    mousePosition.set({
        x: event.clientX,
        y: event.clientY,
    });
    console.log({window})
    if (window.h -  pos.y < menu.h)
        pos.y = pos.y - menu.h
    if (window.w -  pos.x < menu.w)
        pos.x = pos.x - menu.w
}