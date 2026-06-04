import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-mcp")
  ],
  docs: {
    docsMode: true
  },
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  // Use the TypeScript-compiler docgen instead of the default `react-docgen`.
  // The default is "much faster but incomplete" (per Storybook's TS-config docs)
  // and can't extract JSDoc from complex prop types — e.g. Button's
  // `{…} & ButtonHTMLAttributes & { [`data-${string}`]: … }` intersection came
  // back with empty prop descriptions through the MCP. The TS extractor resolves
  // intersections/inherited types and reads JSDoc reliably (also needed for this
  // monorepo's multi-package components consumed as source).
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Storybook's documented default filter: keep each component's own API,
      // drop props inherited from node_modules (DOM/react-aria attributes).
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;

// Resolve an addon/framework to an absolute path so Storybook works in monorepo
// / pnpm setups where packages aren't hoisted to a flat node_modules.
function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
