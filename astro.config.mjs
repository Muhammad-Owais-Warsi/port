// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeMark from "./src/integrations/rehype-mark";
import llms from "./src/integrations/llms";


export default defineConfig({
    site: "https://owais.is-a.dev",
    base: "/",
    integrations: [mdx({ gfm: false, remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeSlug, rehypeKatex, rehypeMark] }), sitemap(), react(), llms()],
    build: {
        assets: "assets",
    },

    vite: {
        plugins: [tailwindcss()],
    },
});
