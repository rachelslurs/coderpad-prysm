import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stethoscope } from "lucide-react";
import IconTile from "./IconTile";

const meta = {
  title: "Data Display/IconTile",
  component: IconTile,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          'Tinted square holding a single icon — the "icon chip" used in list rows, detail fields, and headers. `tone` sets a `*-50` background behind a `*-600` glyph.',
          "",
          "**When to use:** a small standalone semantic/decorative icon affordance.",
          "",
          "**When not to use:** when the icon needs a label/value beside it, use **IconField**; for a labelled status chip, use **Badge**; for a person, use **Avatar**.",
          "",
          "The icon is rendered `aria-hidden` — pair it with a visible label (as IconField does) when it carries meaning.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["neutral", "accent", "info", "success", "warning", "danger"],
    },
    size: { control: "inline-radio", options: ["sm", "md"] },
  },
  args: { icon: Stethoscope, tone: "accent", size: "md" },
} satisfies Meta<typeof IconTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Danger: Story = { args: { tone: "danger" } };
