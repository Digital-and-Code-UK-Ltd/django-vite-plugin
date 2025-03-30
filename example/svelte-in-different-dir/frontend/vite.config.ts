import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { djangoVitePlugin } from "django-vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  root: "./",
  build: {
    emptyOutDir: true,
    sourcemap: true,
    outDir: "dist",
    rollupOptions: {
      output: {
        assetFileNames: "[name]/main.[ext]",
        chunkFileNames: "[name]/main.js",
        entryFileNames: "[name]/main.js",
      },
    },
  },
  plugins: [
    svelte(),
    djangoVitePlugin({
      input: ["./src/main.ts"],
      root: "../project",
    }),
  ],
});
