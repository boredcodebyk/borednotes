import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { phosphorSvelteOptimize } from "phosphor-svelte/preprocessor";
export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess:[phosphorSvelteOptimize(), vitePreprocess()],
};
