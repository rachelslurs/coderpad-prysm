import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertOctagon, CheckCircle } from "lucide-react";
import Badge from "./Badge";
import type { Tone } from "../types";

const TONES: Tone[] = [
  "neutral",
  "accent",
  "info",
  "success",
  "warning",
  "danger",
];

const meta = {
  title: "Data Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Generic labelled status pill — color keyed to a semantic `tone`, not a domain concept. Any labelled chip (status, category, count, severity, risk flag) is a Badge. Redundant encoding (color + optional icon + text) keeps it WCAG-friendly: the label still reads without color.",
          "",
          "**When to use:** a small, non-interactive label that conveys state or category.",
          "",
          '**When not to use:** for a *clickable* chip-style control, use **Button** (`variant="outline"`/`"ghost"`) — a Badge is never a button. For a standalone tinted icon with no label, use **IconTile**. For one-of-N *selectable* chips, use **Segmented**.',
          "",
          "**`interactive`:** deepens the badge on ancestor `.group` hover (e.g. a table row) — a *visual* affordance only; it does not make the badge clickable.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    tone: { control: "inline-radio", options: TONES },
    size: { control: "inline-radio", options: ["sm", "md"] },
    interactive: { control: "boolean" },
  },
  args: { tone: "neutral", size: "md", children: "Label", interactive: false },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: { tone: "danger", icon: AlertOctagon, children: "Critical" },
};

export const Small: Story = {
  args: { size: "sm", tone: "danger", icon: AlertOctagon, children: "Fall Risk" },
};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {TONES.map((tone) => (
        <Badge key={tone} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
};

export const Success: Story = {
  args: { tone: "success", icon: CheckCircle, children: "Passed" },
};
