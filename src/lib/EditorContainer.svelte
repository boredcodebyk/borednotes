<script lang="ts">
    import { EditorView, basicSetup } from "codemirror";
    import { EditorState, type StateCommand } from "@codemirror/state";
    import {
        history,
        historyKeymap,
        defaultKeymap,
        indentLess,
        indentMore,
    } from "@codemirror/commands";
    import {
        closeBrackets,
        closeBracketsKeymap,
    } from "@codemirror/autocomplete";
    import { bracketMatching, indentOnInput } from "@codemirror/language";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { keymap } from "@codemirror/view";
    import { readTextFile } from "@tauri-apps/api/fs";
    import { activeTab } from "./model/store";
    import { saveFile } from "./model/filehandle";
    import { get } from "svelte/store";
    export let initFinished = false;
    let editorContainer: HTMLElement;
    let editor: EditorView;
    let editorState: EditorState;
    let lineNumber: number = 1;
    let colNumber: number = 1;
    const dispatch = createEventDispatcher();

    function dispatchEvent(name, data) {
        dispatch(name, {
            data: data,
        });
    }

    function setText(text) {
        if (initFinished) {
            initEditorState(text);
        }
    }

    const insertTab: StateCommand = ({ state, dispatch }) => {
        dispatch(
            state.update({
                changes: {
                    from: state.doc.lineAt(state.selection.main.head).from,
                    insert: "\t",
                },
            }),
        );
        return true;
    };

    function initEditorState(text: string) {
        editorContainer.innerHTML = "";

        let editorExtensions = [
            history(),
            closeBrackets(),
            bracketMatching(),
            indentOnInput(),
            keymap.of([
                ...defaultKeymap,
                ...historyKeymap,
                ...closeBracketsKeymap,
                {
                    key: "Tab",
                    preventDefault: true,
                    run: insertTab,
                },
                {
                    key: "Shift-Tab",
                    preventDefault: true,
                    run: indentLess,
                },
            ]),
            EditorView.lineWrapping,
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    saveFile(get(activeTab).path,getText());
                    dispatchEvent("textChanged", {
                        value: getText(),
                        // cursor: getCursor(),
                        history: {},
                        getLine: getLineCol(),
                    });
                }
            }),
        ];

        editorState = EditorState.create({
            doc: text,
            extensions: editorExtensions,
        });

        editor = new EditorView({
            state: editorState,
            parent: editorContainer,
        });
    }
    onMount(() => {
        readTextFile($activeTab.path).then((value) => {
            initEditorState(value);
        });
        dispatchEvent("editorChange", {
            getLine: getLineCol(),
        });
        focus();
        return () => {};
    });

    function focus() {
        if (typeof editor !== "undefined") {
            editor.focus();
        }
    }

    function getText() {
        if (typeof editor !== "undefined") {
            return editor.state.doc.toString();
        }
    }

    function getLineCol() {
        if (typeof editor !== "undefined") {
            lineNumber = editor.state.doc.lineAt(
                editor.state.selection.main.head,
            ).number;
            colNumber =
                editor.state.doc.lineAt(editor.state.selection.main.head).to -
                editor.state.doc.lineAt(editor.state.selection.main.head).from +
                1;
        }
    }
</script>

<div class="editor__container" bind:this={editorContainer}></div>
<footer class="sub__footer">Ln {lineNumber}, Col {colNumber}</footer>

<style>
    .editor__container {
        width: 100%;
        height: calc(100% - 24px);
        overflow-y: scroll;
    }

    .sub__footer {
        background-color: var(--surfaceContainerHigh);
        color: var(--onSurface);
        border-top: 1px solid var(--outlineVariant);
        height: 24px;
        z-index: 5;
        width: calc(100dvw - 432px);
        left: 432px;
        position: fixed;
        bottom: 0;
        text-align: right;
        font-size: 12px;
        padding: 0 24px 0 0;
    }
</style>
