import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Keep browser globals
        ...globals.node,    // Add Node.js globals
      },
    },
  },
  pluginJs.configs.recommended,
];