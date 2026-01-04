import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  outDir: "./dist",
  clean: true,
  // Bundle ALL dependencies for a self-contained production build
  // This eliminates the need to install node_modules in the Docker image
  noExternal: [/.*/],
});
