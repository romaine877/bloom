import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  outDir: "./dist",
  clean: true,
  // Bundle ALL dependencies for a self-contained production build
  // This eliminates the need to install node_modules in the Docker image
  noExternal: [/.*/],
  // Inject shims for __dirname and __filename in ESM build
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);import { fileURLToPath } from 'url';import { dirname } from 'path';const __filename = fileURLToPath(import.meta.url);const __dirname = dirname(__filename);`,
  },
});
