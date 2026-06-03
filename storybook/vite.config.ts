import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// Storybook's react-vite framework supplies the React plugin; we only need to
// add Tailwind so utilities resolve inside the preview. Vitest also reads this
// config (it merges with vitest.config.ts) for component tests.
export default defineConfig({
  plugins: [tailwindcss()],
});
