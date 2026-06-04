import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Standalone interview aid. Runs on its own port (5180) so it can sit alongside
// the app (5173) and Storybook (6006). Served at the Pages root only in a build
// (under /coderpad-prysm/prompt-builder/); local dev stays at "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/coderpad-prysm/prompt-builder/" : "/",
  plugins: [react(), tailwindcss()],
  server: { port: 5180 },
}));
