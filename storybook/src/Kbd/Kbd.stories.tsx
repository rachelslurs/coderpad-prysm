import type { Meta, StoryObj } from "@storybook/react-vite";
import Kbd from "./Kbd";

const meta = {
  title: "Keyboard/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          'A keyboard keycap (semantic `<kbd>`) for shortcut hints — "/", "ESC", ⌘K.',
          "",
          "**When to use:** display a keyboard shortcut inline (e.g. next to a search field).",
          "",
          "**When not to use:** for anything interactive — Kbd is display-only.",
        ].join("\n"),
      },
    },
  },
  args: { children: "ESC" },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Slash: Story = { args: { children: "/" } };
