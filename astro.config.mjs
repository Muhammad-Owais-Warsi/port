// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    site: "https://owais.dev",
    integrations: [mdx(), sitemap(), react()],
    viewTransitions: false,

    vite: {
        plugins: [tailwindcss()],
    },
});
