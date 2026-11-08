import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    // eslint-plugin-react-hooks 7 (pulled in by eslint-config-next 16) adds
    // React Compiler rules that flag existing effects in InfiniteImageSlider,
    // Archive and NewsletterTestButton. This app does not use the React
    // Compiler; the refactor is tracked in ROADMAP.md. Warnings keep them visible.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", ".claude/**"]),
]);

export default eslintConfig;
