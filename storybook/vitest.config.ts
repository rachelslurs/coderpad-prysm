import { defineConfig } from "vitest/config";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [{
      extends: true,
      test: {
        environment: "jsdom",
        setupFiles: "./src/test/setup.ts"
      }
    }, {
      extends: true,
      plugins: [
      // Tailwind v4 plugin so the design-system token CSS (theme.css) and utility
      // classes are processed in the browser test build — vitest uses this config,
      // not vite.config.ts, so the plugin must be declared here too.
      tailwindcss(),
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});