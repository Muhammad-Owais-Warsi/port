// Rehype plugin: turns ==highlighted== into <mark>highlighted</mark>.
// `==` is not standard Markdown/GFM, so remark leaves it as literal text.
// This runs on the HTML tree after Markdown is parsed, splitting text
// nodes on ==...== pairs. Skips <pre>/<code> so code samples are untouched.

function splitText(value: string): any[] {
    const out: any[] = [];
    const re = /==([^=\n]+?)==/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(value)) !== null) {
        if (m.index > last) {
            out.push({ type: "text", value: value.slice(last, m.index) });
        }
        out.push({
            type: "element",
            tagName: "mark",
            properties: {},
            children: [{ type: "text", value: m[1] }],
        });
        last = m.index + m[0].length;
    }
    if (last < value.length) {
        out.push({ type: "text", value: value.slice(last) });
    }
    return out;
}

function visit(node: any, inCode: boolean): void {
    if (!node || !node.children) return;
    const isCode =
        node.type === "element" &&
        (node.tagName === "pre" || node.tagName === "code");
    const nowInCode = inCode || isCode;
    const kids: any[] = node.children;
    for (let i = 0; i < kids.length; i++) {
        const child = kids[i];
        if (
            child.type === "text" &&
            !nowInCode &&
            typeof child.value === "string" &&
            child.value.includes("==")
        ) {
            const parts = splitText(child.value);
            kids.splice(i, 1, ...parts);
            i += parts.length - 1;
        } else if (child.children) {
            visit(child, nowInCode);
        }
    }
}

export default function rehypeMark() {
    return (tree: any) => {
        visit(tree, false);
    };
}
