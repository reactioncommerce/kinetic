/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts"
  },
  server: {
    host: "0.0.0.0",
    port: 3001
  },
  resolve: {
    alias: [
      { find: "@hooks", replacement: path.resolve(__dirname, "src/hooks") },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/components")
      },
      { find: "@utils", replacement: path.resolve(__dirname, "src/utils") },
      {
        find: "@containers",
        replacement: path.resolve(__dirname, "src/containers")
      },
      { find: "@graphql", replacement: path.resolve(__dirname, "src/graphql") },
      { find: "types", replacement: path.resolve(__dirname, "src/types") },
      { find: "@mocks", replacement: path.resolve(__dirname, "src/mocks") }
    ]
  },
  plugins: [react()]
});
