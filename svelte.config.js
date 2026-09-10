import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],

  preprocess: [
    mdsvex({
      extensions: [".md"],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }]
      ],
    }),
    vitePreprocess(),
  ],

  kit: {
    adapter: adapter(),
  },
};

export default config;