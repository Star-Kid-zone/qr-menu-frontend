import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // next/image throws on a remote host outside images.remotePatterns, and
    // image URLs come from the database. The wrapper falls back to unoptimized.
    ignores: ["src/components/ui/Image.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/image",
              importNames: ["default"],
              message: "Import Image from '@/components/ui/Image' instead.",
            },
          ],
        },
      ],
    },
  },
  {
    // Intentionally unused names start with an underscore; destructuring away a prop so it does
    // not reach `...rest` is fine.
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none", ignoreRestSiblings: true },
      ],
    },
  },
  {
    // Admin previews of user-supplied, AI-generated, blob: and base64 images from arbitrary hosts,
    // sized by their CSS parent: next/image (fixed width/height + host allow-list) does not apply.
    // Guest-facing pages keep the rule on and use components/ui/Image.
    files: ["src/features/social/**", "src/features/superadmin/creative-studio/**"],
    rules: { "@next/next/no-img-element": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Agent tooling (vendored skill scripts), not app source.
    ".agents/**",
    ".claude/**",
    ".impeccable/**",
  ]),
]);

export default eslintConfig;
