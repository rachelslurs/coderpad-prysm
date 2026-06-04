import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stethoscope } from "lucide-react";
import IconField from "./IconField";

const meta = {
  title: "Data Display/IconField",
  component: IconField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          'Icon chip + label/value row — the recurring "icon · label · value" line. Composes **IconTile** + **Field**.',
          "",
          "**When to use:** a detail row that benefits from a leading tinted icon (Stethoscope · Attending Physician · Dr. Patel).",
          "",
          "**When not to use:** when no icon is needed, use **Field** directly; for just the tinted icon (no label/value), use **IconTile**.",
          "",
          "`tone` colors the IconTile; `size` is forwarded to the inner Field.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["neutral", "accent", "info", "success", "warning", "danger"],
    },
    size: { control: "inline-radio", options: ["md", "lg"] },
  },
  args: {
    icon: Stethoscope,
    label: "Attending Physician",
    tone: "accent",
    size: "md",
    children: "Dr. Sandra Patel",
  },
} satisfies Meta<typeof IconField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
