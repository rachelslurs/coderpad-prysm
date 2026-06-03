import type { Preview } from "@storybook/react-vite";
import "../src/styles/tokens.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Surface a11y findings in the panel without failing the build — this
      // codebase already leans hard on accessible patterns; the addon is a
      // guardrail, not a gate.
      test: "todo",
    },
  },
  // Components are authored against the app's Figtree + slate canvas. Wrap every
  // story so they read the same in isolation.
  decorators: [
    (Story) => (
      <div className="bg-neutral-50 font-['Figtree'] text-neutral-900 p-6">
        <Story />
      </div>
    ),
  ],
};

export default preview;
