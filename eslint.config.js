import { defineConfig, globalIgnores } from "eslint/config";
import jseslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reacteslint from "eslint-plugin-react";

let parseIgnoreList = [
  "**/node_modules/**/*",
  "**/.meteor/**/*",
  "**/.git/**/*",
  "**/.vscode/**/*",
];

let globalConfigList = [globalIgnores(parseIgnoreList)];

// React eslint config
// https://www.npmjs.com/package/eslint-plugin-react
let reactRecommendedConfig = {
  ...reacteslint.configs.flat.recommended,
  files: ["**/*.jsx", "**/*.tsx"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    ...reacteslint.configs.flat.recommended.rules,
    "react/no-unescaped-entities": "off",
    "react/jsx-no-target-blank": "warn",
    "react/jsx-key": "warn",
  },
};

let reactJSXConfig = reacteslint.configs.flat["jsx-runtime"];

let reactConfigList = [reactRecommendedConfig, reactJSXConfig];

// TypeScript eslint config
// https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
let tsRecommendedConfig = tseslint.configs.recommended.map((config) => {
  return {
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      ...config.rules,
      "@typescript-eslint/no-unused-vars": "warn",
    },
  };
});

let tsConfigList = [tsRecommendedConfig];

// JS eslint config
// https://www.npmjs.com/package/@eslint/js
let jsRecommendedConfig = {
  ...jseslint.configs.recommended,
  files: ["**/*.js", "**/*.jsx"],
  rules: {
    ...jseslint.configs.recommended.rules,
    "no-unused-vars": "warn",
  },
};

let jsConfigList = [jsRecommendedConfig];

export default defineConfig([
  ...reactConfigList,
  ...tsConfigList,
  ...jsConfigList,
  ...globalConfigList,
]);