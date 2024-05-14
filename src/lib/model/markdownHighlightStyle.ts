
import { HighlightStyle } from "@codemirror/language";
import { tags, Tag, styleTags } from "@lezer/highlight";
export const highlightStyle = HighlightStyle.define([
    {
        tag: tags.heading1,
        color: "var(--onSurface)",
        fontSize: "2em",
        fontWeight: "400",
    },
    {
        tag: tags.heading2,
        color: "var(--onSurface)",
        fontSize: "1.75em",
        fontWeight: "400",
    },
    {
        tag: tags.heading3,
        color: "var(--onSurface)",
        fontSize: "1.5em",
        fontWeight: "400",
    },
    {
        tag: tags.heading4,
        color: "var(--onSurface)",
        fontSize: "1.375em",
        fontWeight: "400",
    },
    {
        tag: tags.heading5,
        color: "var(--onSurface)",
        fontSize: "1em",
        fontWeight: "400",
    },
    {
        tag: tags.heading6,
        color: "var(--onSurface)",
        fontSize: "0.875em",
        fontWeight: "400",
    },
    {
        tag: tags.content,
        color: "var(--onSurface)",
        fontSize: "0.875em",
        fontWeight: "400",
    },
    {
        tag: tags.link,
        color: "var(--primary)"
    }
]);