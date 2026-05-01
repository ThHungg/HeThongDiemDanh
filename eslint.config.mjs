import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Tắt hoàn toàn cảnh báo "Unexpected any"
      "@typescript-eslint/no-explicit-any": "off",

      // Nếu bạn muốn tắt cả cảnh báo khi dùng any trong mảng (ví dụ: any[])
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
]);

export default eslintConfig;
