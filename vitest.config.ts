import {defineConfig} from "vite";
import {svelte} from "@sveltejs/vite-plugin-svelte";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default defineConfig({
    plugins: [svelte({hot: !process.env.VITEST})],
    test: {
        globals: true,
        environment: "jsdom",
    },
});
