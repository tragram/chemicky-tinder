import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import yaml from "unplugin-yaml/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/chemicky-tinder/",
  plugins: [react(), tsconfigPaths(), yaml()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
})
