import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    ignores: ["lib/**"],
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: ["lib/**"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    ignores: ["lib/**"],
    extends: tseslint.configs.recommended,
  },
]);
