import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = tseslint.config(
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/.git/**", "**/dist/**"]
  },
  // Base React and Hooks warnings
  ...compat.extends("plugin:react/recommended", "plugin:react-hooks/recommended"),
  ...tseslint.configs.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Not needed in Next.js/React 17+
      "react/prop-types": "off", // TypeScript handles this
    },
  },
);

export default eslintConfig;
