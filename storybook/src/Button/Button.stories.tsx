import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ArrowLeft, Plus, Check } from "lucide-react";
import Button from "./Button";

const meta = {
  title: "Actions/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "The action control — one per action cluster, in three emphasis levels (`variant`) and six semantic `tone`s.",
          "",
          "**When to use:** any click/tap that *performs an action* — submit, open, navigate, mark complete.",
          "",
          "**When not to use:** for a labelled, non-interactive status or count, use **Badge**; for a binary on/off setting, use **Toggle**; for picking one option from a small fixed set, use **Segmented**.",
          "",
          "**Emphasis (`variant`):** `solid` = the one main action · `outline` = a lower-emphasis action beside a solid one (Cancel, Save for later) · `ghost` = tertiary / low-stakes (Skip, Back).",
          "",
          "**Size:** `md` (default) and `sm` for dense desktop toolbars; `touch` is the **48px** min-height mobile/gloved-hand target — use it for primary actions on touch surfaces.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["solid", "outline", "ghost"] },
    tone: {
      control: "inline-radio",
      options: ["neutral", "accent", "info", "success", "warning", "danger"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "touch"] },
  },
  args: { variant: "solid", tone: "accent", size: "md", children: "Button" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {};
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = {
  args: { variant: "ghost", iconLeft: ArrowLeft, children: "Back" },
};
export const WithIcon: Story = {
  args: { iconLeft: Plus, children: "Add" },
};
export const Touch: Story = {
  args: { size: "touch", iconLeft: Check, children: "Mark complete" },
};

// The single project-wide CssCheck: proves the design-system token CSS
// (theme.css's @theme tokens) actually loaded into the preview. Our neutral
// scale is authored as hex from the design bundle; custom-property values are
// returned verbatim (not color-normalized), so this is deterministic. If
// theme.css didn't load, the variable resolves to "".
export const CssCheck: Story = {
  args: { size: "touch", children: "Mark complete" },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /mark complete/i });
    const neutral900 = getComputedStyle(button)
      .getPropertyValue("--color-neutral-900")
      .trim();
    await expect(neutral900).toBe("#0c1526");
  },
};
