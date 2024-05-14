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
    import {
        HighlightStyle,
        bracketMatching,
        indentOnInput,
        syntaxHighlighting,
    } from "@codemirror/language";
    import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
    import { keymap } from "@codemirror/view";

    import { type MarkdownConfig } from "@lezer/markdown";
    import { tags, Tag, styleTags } from "@lezer/highlight";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { readTextFile } from "@tauri-apps/api/fs";
    import {
        activeTab,
        persistedState,
        tabs,
        type activeTabFormat,
    } from "./model/store";
    import {
        readWorkspaceDir,
        renameFileInWorkspace,
        saveFile,
    } from "./model/filehandle";
    import { highlightStyle } from "./model/markdownHighlightStyle";
    import { get } from "svelte/store";
    import { languages } from "@codemirror/language-data";
    export let initFinished = false;
    let editorContainer: HTMLElement;
    let editor: EditorView;
    let editorState: EditorState;
    let lineNumber: number = 1;
    let colNumber: number = 1;
    let fileName: string = $activeTab.filename.split(".md")[0];
    
    const dispatch = createEventDispatcher();

    function refreshEditorTitle() {
        fileName = $activeTab.filename.split(".md")[0];
    }

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

    const customTags = {
        headingMark: Tag.define(),
    };

    const MarkStylingExtension: MarkdownConfig = {
        props: [
            styleTags({
                HeadingMark: customTags.headingMark,
            }),
        ],
    };

    function initEditorState(text: string) {
        editorContainer.innerHTML = "";

        let editorExtensions = [
            basicSetup,
            markdown({
                addKeymap: true,
                base: markdownLanguage,
                defaultCodeLanguage: markdownLanguage,
                codeLanguages: languages,
                extensions: [MarkStylingExtension],
            }),
            syntaxHighlighting(highlightStyle),
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
                    saveFile(get(activeTab).path, getText());
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
        return () => {
            editor.destroy();
        };
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

    async function rename(newFilename: string) {
        var path = $activeTab.path.split($activeTab.filename)[0];
        await renameFileInWorkspace(newFilename,path);
        var updateActiveTab: activeTabFormat = {
            id: $activeTab.id,
            filename: `${newFilename.split("/").pop()}.md`,
            path: `${path}${newFilename.split(path).join("/")}.md`,
        };
        var activeTabIndex = $tabs.findIndex((v) => v.id === $activeTab.id);

        var alltabs = $tabs;

        alltabs.splice(activeTabIndex, 1, updateActiveTab);
        $tabs = alltabs;

        $activeTab = updateActiveTab;
        readWorkspaceDir($persistedState.workspace.path);
        refreshEditorTitle();
    }
</script>
<div class="editor__container">
    <input
        class="editor__title"
        on:change={() => rename(fileName)}
        bind:value={fileName}
    />
    <div bind:this={editorContainer}></div>
</div>

<footer class="sub__footer">Ln {lineNumber}, Col {colNumber}</footer>

<style>
    .editor__container {
        width: 100%;
        height: calc(100% - 24px);
        overflow-y: scroll;
    }

    .editor__title {
        padding: 1em 5em 1em 5em;
        width: 100%;
        font-size: 2em;
        background-color: var(--surfaceContainer);
        color: var(--onSurface);
        border: none;
        user-select: none;
        -webkit-user-select: none;
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
