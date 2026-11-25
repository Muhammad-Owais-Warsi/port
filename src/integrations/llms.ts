import type { AstroIntegration } from "astro";
import fs from "node:fs";
import path from "node:path";

function parseFrontmatter(content: string) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};
    const yaml = match[1];
    const data: Record<string, string> = {};
    for (const line of yaml.split("\n")) {
        const kv = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
        if (kv) data[kv[1]] = kv[2];
    }
    return data;
}

function parseTsArray(filePath: string, exportName: string): any[] {
    const content = fs.readFileSync(filePath, "utf-8");
    const regex = new RegExp(
        `export const ${exportName}:\\s*\\w+\\[\\]\\s*=\\s*(\\[[\\s\\S]*?\\]);`
    );
    const match = content.match(regex);
    if (!match) return [];
    const raw = match[1];
    const items: any[] = [];
    const objBlocks = raw.match(/\{[^{}]*\}/g) || [];
    for (const block of objBlocks) {
        const obj: Record<string, string> = {};
        const pairs = block.matchAll(
            /(\w+):\s*(?:"([^"]*)"|(\[[^\]]*\])|(true|false))/g
        );
        for (const [, key, strVal, arrVal, boolVal] of pairs) {
            if (arrVal) {
                obj[key] = arrVal
                    .replace(/[\[\]"]/g, "")
                    .split(",")
                    .map((s: string) => s.trim());
            } else if (boolVal) {
                obj[key] = boolVal === "true";
            } else {
                obj[key] = strVal;
            }
        }
        items.push(obj);
    }
    return items;
}

interface ParsedBenchmark {
    name: string;
    date: string;
    description: string;
    url: string;
    orgs: { name: string; url: string }[];
}

function parseBenchmarks(filePath: string): ParsedBenchmark[] {
    const content = fs.readFileSync(filePath, "utf-8");
    const match = content.match(
        /export const BENCHMARKS:\s*\w+\[\]\s*=\s*(\[[\s\S]*\]);/
    );
    if (!match) return [];
    const raw = match[1];

    // Extract top-level object blocks using brace depth
    const blocks: string[] = [];
    let depth = 0;
    let start = -1;
    let inString = false;
    for (let i = 0; i < raw.length; i++) {
        const ch = raw[i];
        if (ch === '"' && raw[i - 1] !== "\\") {
            inString = !inString;
            continue;
        }
        if (inString) continue;
        if (ch === "{") {
            if (depth === 0) start = i;
            depth++;
        } else if (ch === "}") {
            depth--;
            if (depth === 0 && start !== -1) {
                blocks.push(raw.slice(start, i + 1));
                start = -1;
            }
        }
    }

    return blocks.map((block) => {
        const orgsMatch = block.match(/orgs:\s*\[([\s\S]*?)\]/);
        const withoutOrgs = orgsMatch
            ? block.replace(orgsMatch[0], "")
            : block;
        const getField = (key: string) =>
            withoutOrgs.match(new RegExp(`${key}:\\s*"([^"]*)"`))?.[1] ?? "";

        const orgs: { name: string; url: string }[] = [];
        if (orgsMatch) {
            const orgBlocks = orgsMatch[1].match(/\{[^{}]*\}/g) || [];
            for (const ob of orgBlocks) {
                const orgName = ob.match(/name:\s*"([^"]*)"/)?.[1];
                const orgUrl = ob.match(/url:\s*"([^"]*)"/)?.[1];
                if (orgName && orgUrl) {
                    orgs.push({ name: orgName, url: orgUrl });
                }
            }
        }

        return {
            name: getField("name"),
            date: getField("date"),
            description: getField("description"),
            url: getField("url"),
            orgs,
        };
    });
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function generateLlmsTxt(): string {
    const root = process.cwd();
    const srcDir = path.join(root, "src");

    // Read blog posts
    const blogDir = path.join(srcDir, "content/blog");
    const blogEntries = fs
        .readdirSync(blogDir)
        .filter((f) => fs.statSync(path.join(blogDir, f)).isDirectory())
        .map((dir) => {
            const mdxPath = path.join(blogDir, dir, "index.mdx");
            const mdPath = path.join(blogDir, dir, "index.md");
            const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;
            const content = fs.readFileSync(filePath, "utf-8");
            const fm = parseFrontmatter(content);
            return {
                title: fm.title ?? dir,
                description: fm.description ?? "",
                pubDate: fm.pubDate ?? "",
                slug: dir,
            };
        })
        .sort(
            (a, b) =>
                new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        );

    // Read notes
    const notesDir = path.join(srcDir, "content/notes");
    const notesEntries = fs
        .readdirSync(notesDir)
        .filter((f) => fs.statSync(path.join(notesDir, f)).isDirectory())
        .map((dir) => {
            const mdxPath = path.join(notesDir, dir, "index.mdx");
            const mdPath = path.join(notesDir, dir, "index.md");
            const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;
            const content = fs.readFileSync(filePath, "utf-8");
            const fm = parseFrontmatter(content);
            return {
                title: fm.title ?? dir,
                description: fm.description ?? "",
                pubDate: fm.pubDate ?? "",
                slug: dir,
            };
        })
        .sort(
            (a, b) =>
                new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        );

    // Parse data from TS files
    const projects = parseTsArray(
        path.join(srcDir, "data/projects.ts"),
        "PROJECTS"
    );
    const contributions = parseTsArray(
        path.join(srcDir, "data/contributions.ts"),
        "CONTRIBUTIONS"
    );
    const experiences = parseTsArray(
        path.join(srcDir, "data/experience.ts"),
        "EXPERIENCES"
    );
    const benchmarks = parseBenchmarks(path.join(srcDir, "data/benchmarks.ts"));

    const lines: string[] = [];
    lines.push("# Muhammad Owais Warsi — Portfolio & Blog");
    lines.push("");
    lines.push(
        "> Full Stack developer. Building products across full-stack applications, SDKs, and developer tools. "
    );
    lines.push("");
    lines.push("## Site");
    lines.push("");
    lines.push(
        "- [Home](https://owais.is-a.dev/): Portfolio home page with hero, about, experience, benchmarks & research, projects, and open source sections."
    );
    lines.push(
        "- [Blog](https://owais.is-a.dev/blog/): Collection of technical blog posts."
    );
    lines.push(
        "- [Notes](https://owais.is-a.dev/notes/): Quick notes and references."
    );
    lines.push(
        "- [RSS Feed](https://owais.is-a.dev/rss.xml): Subscribe to new blog posts."
    );
    lines.push(
        "- [Sitemap](https://owais.is-a.dev/sitemap-index.xml): Full site sitemap."
    );
    lines.push("");
    lines.push("## About");
    lines.push("");
    lines.push(
        "Muhammad Owais Warsi is a full stack developer who builds products across the stack — from full stack applications to SDKs and developer tools. He writes about systems, databases, networking, and software engineering."
    );
    lines.push("");
    lines.push("## Work Experience");
    lines.push("");
    for (const exp of experiences) {
        const period = exp.end
            ? `${exp.start} to ${exp.end}`
            : `${exp.start} to Present`;
        const typeSuffix = exp.type ? ` (${exp.type})` : "";
        lines.push(
            `- **${exp.role}** at ${exp.company}${typeSuffix} — ${period}`
        );
    }
    lines.push("");
    lines.push("## Benchmarks & Research");
    lines.push("");
    for (const b of benchmarks) {
        const orgLinks = b.orgs.map((o) => `[${o.name}](${o.url})`);
        const builtWith =
            orgLinks.length > 1
                ? `Built with ${orgLinks.slice(0, -1).join(", ")} & ${orgLinks[orgLinks.length - 1]}`
                : orgLinks.length === 1
                  ? `Built with ${orgLinks[0]}`
                  : "";
        const meta = [builtWith, b.date].filter(Boolean).join(", ");
        const rawDesc = (b.description ?? "").trim();
        const desc = /[.?!]$/.test(rawDesc) ? rawDesc : `${rawDesc}.`;
        lines.push(
            `- **${b.name}**${meta ? ` (${meta})` : ""}: ${desc} [Link](${b.url})`
        );
    }
    lines.push("");
    lines.push("## Projects");
    lines.push("");
    for (const p of projects) {
        const stack = Array.isArray(p.stack) ? p.stack.join(", ") : (p.stack ?? "");
        const desc = (p.description ?? "").replace(/\.$/, "");
        const rank = p.launched_position
            ? ` — ${p.launched_position} Product of the Week on Peerlist`
            : "";
        lines.push(
            `- **${p.name}**: ${desc}. [Link](${p.url}) (${stack})${rank}`
        );
    }
    lines.push("");
    lines.push("## Open Source Contributions");
    lines.push("");
    for (const c of contributions) {
        const desc = (c.description ?? "").replace(/\.$/, "");
        lines.push(`- **${c.name}**: ${desc}. [Link](${c.url})`);
    }
    lines.push("");
    lines.push("## Blog Posts");
    lines.push("");
    for (const post of blogEntries) {
        const date = formatDate(post.pubDate);
        lines.push(
            `- [${post.title}](https://owais.is-a.dev/blog/${post.slug}/): ${post.description} (${date})`
        );
    }
    lines.push("");
    lines.push("## Notes");
    lines.push("");
    for (const note of notesEntries) {
        const date = formatDate(note.pubDate);
        lines.push(
            `- [${note.title}](https://owais.is-a.dev/notes/${note.slug}/): ${note.description} (${date})`
        );
    }
    lines.push("");

    return lines.join("\n");
}

export default function llmsIntegration(): AstroIntegration {
    return {
        name: "llms-txt",
        hooks: {
            "astro:build:done": async ({ dir }) => {
                const content = generateLlmsTxt();
                const outPath = path.join(dir.pathname, "llms.txt");
                fs.writeFileSync(outPath, content, "utf-8");
                console.log(`✓ Generated llms.txt`);
            },
        },
    };
}
