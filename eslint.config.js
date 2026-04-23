import { fileURLToPath } from "node:url";
import path from "node:path";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

//================================================

const internalImportsOrder = [
  "@(~/api)",
  "@(~/app)",
  "@(~/data)",
  "@(~/context)",
  "@(~/routing)",
  "@(~/theme)",
  "@(~/utils)",
  "@(~/components)",
  "~/components/*",
  "@(~/assets)",
];

const muiExternalImportsOrder = [
  "@mui/base/**",
  "@mui/material/styles",
  "@mui/material/useMediaQuery",
  "@mui/system/**",
  "@mui/utils",
];

const muiComponentImportsOrder = ["@mui/material/**", "@mui/icons-material/*"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const importCompat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: tseslint.configs.recommended,
});

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  importCompat.config({
    plugins: ["import"],
    parser: "@typescript-eslint/parser",
    extends: [
      "plugin:@typescript-eslint/recommended",
      "plugin:import/react",
      "plugin:import/typescript",
    ],
    overrides: [
      {
        files: ["**/*.{ts,tsx}"],
        rules: {
          "import/consistent-type-specifier-style": [
            "error",
            "prefer-top-level",
          ],
          "import/no-anonymous-default-export": "off",
          "import/no-unresolved": "error",
          "import/no-duplicates": "error",
          "import/no-internal-modules": [
            "error",
            {
              forbid: [
                "@mui/*/*/**",
                "@mui/material",
                "@mui/icons-material",
                "~/components/**/*",
                "~/components/!(routes)",
                "../*/**",
                "../../*/**",
                "../../../*/**",
                "../../../../*/**",
              ],
            },
          ],
          "import/order": [
            "error",
            {
              "newlines-between": "always",
              groups: [
                ["builtin", "external"],
                ["internal"],
                ["parent", "sibling", "index", "object"],
                ["unknown"],
                "type",
              ],
              pathGroups: [
                ...muiExternalImportsOrder.map((pattern) => ({
                  pattern,
                  group: "external",
                })),
                ...internalImportsOrder.map((pattern) => ({
                  pattern,
                  group: "parent",
                })),
                ...muiComponentImportsOrder.map((pattern) => ({
                  pattern,
                  group: "unknown",
                })),
              ],
              distinctGroup: false,
              pathGroupsExcludedImportTypes: ["type"],
              sortTypesGroup: true,
            },
          ],
        },
      },
    ],
    ignorePatterns: ["dist/**/*", "**/*.html", "**/*.min.js", "**/.next/**/*"],
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          project: ["tsconfig.*.json"],
        },
      },
      "import/extensions": [".ts", ".tsx"],
    },
  }),
]);
