const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "supabase/**",
      "public/**",
      "scratch/**",
      "update_categories.js",
      "eslint.config.js",
      "tailwind.config.ts",
      "postcss.config.js",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Underscore-prefixed names are an intentional "intentionally unused" convention
      // used throughout the shadcn/ui primitives in components/ui/.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
