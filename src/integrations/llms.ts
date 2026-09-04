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
            /(\w+):\s*(?:"([^"]*)"|(\[[^\]]*\]))/g
        );
        for (const [, key, strVal, arrVal] of pairs) {
            if (arrVal) {
                obj[key] = arrVal
                    .replace(/[\[\]"]/g, "")
                    .split(",")
                    .map((s: string) => s.trim());
            } else {
                obj[key] = strVal;
            }
        }
        items.push(obj);
    }
    return items;
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
        "- [Home](https://owais.is-a.dev/): Portfolio home page with hero, about, experience, projects, and open source sections."
    );
    lines.push(
        "- [Blog](https://owais.is-a.dev/blog/): Collection of technical blog posts."
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
        lines.push(
            `- **${exp.title}** at ${exp.company} (${exp.location ?? "Remote"}) — ${period}`
        );
    }
    lines.push("");
    lines.push("## Projects");
    lines.push("");
    for (const p of projects) {
        const stack = Array.isArray(p.stack) ? p.stack.join(", ") : p.stack;
        const desc = p.description.replace(/\.$/, "");
        lines.push(
            `- **${p.name}**: ${desc}. [Link](${p.url}) (${stack})`
        );
    }
    lines.push("");
    lines.push("## Open Source Contributions");
    lines.push("");
    for (const c of contributions) {
        const desc = c.description.replace(/\.$/, "");
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
