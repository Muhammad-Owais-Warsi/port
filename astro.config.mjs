// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
    site: "https://owais.is-a.dev",
    base: "/",
    integrations: [mdx({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }), sitemap(), react()],
    build: {
        assets: "assets",
    },

    vite: {
        plugins: [tailwindcss()],
    },
});
