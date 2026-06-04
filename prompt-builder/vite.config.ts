import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Standalone interview aid — runs on its own port so it can sit alongside the
// app (5173) and Storybook (6006). No `base`: it's local-only, never deployed.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5180 },
});
