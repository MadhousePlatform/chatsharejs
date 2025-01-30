import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  plugins: [tsconfigPaths({
    root: __dirname,
  })],
  resolve:{
    alias: {
      "@": path.resolve(__dirname, "src"),
      "$": path.resolve(__dirname, "classes"),
      "#": path.resolve(__dirname, "utils"),
      "&": path.resolve(__dirname, "types"),
    }
  }
})