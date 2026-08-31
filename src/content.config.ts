import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// Curated headings for the hover sidebar. Each entry matches the heading
			// text in the post by default; an optional `title` overrides the display label.
			toc: z
				.array(
					z.union([
						z.string(),
						z.object({
							text: z.string(),
							title: z.string().optional(),
						}),
					])
				)
				.optional(),
		}),
});

export const collections = { blog };
