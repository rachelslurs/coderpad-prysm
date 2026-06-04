import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlertOctagon,
  ArrowLeftRight,
  Bed,
  CheckCircle,
  LogIn,
  LogOut,
} from "lucide-react";
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
          "Generic labelled status pill — color keyed to a semantic `tone`, not a domain concept. Any labelled chip (status, category, count, severity, risk flag) is a Badge. Redundant encoding (color + optional icon + text) keeps it WCAG-friendly: the label still reads without color. `fill='solid'` + `pill` raise an item to a significant event (e.g. an admission badge); `iconSpin` animates the icon for in-progress states.",
          "",
          "**When to use:** a small, non-interactive label that conveys state or category.",
          "",
          '**When not to use:** for sync / connectivity state, use **SyncStatus** (a pre-mapped Badge). For a *clickable* chip-style control, use **Button** (`variant="outline"`/`"ghost"`) — a Badge is never a button. For a standalone tinted icon with no label, use **IconTile**. For one-of-N *selectable* chips, use **Segmented**.',
          "",
          "**`interactive`:** deepens the badge on ancestor `.group` hover (e.g. a table row) — a *visual* affordance only; it does not make the badge clickable.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    tone: { control: "inline-radio", options: TONES },
    size: { control: "inline-radio", options: ["sm", "md"] },
    fill: { control: "inline-radio", options: ["tint", "solid"] },
    pill: { control: "boolean" },
    interactive: { control: "boolean" },
  },
  args: {
    tone: "neutral",
    size: "md",
    fill: "tint",
    pill: false,
    children: "Label",
    interactive: false,
  },
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

// Filled treatment — for an event that carries significance, not just a category.
export const Solid: Story = {
  args: { fill: "solid", tone: "info", pill: true, icon: LogIn, children: "Admit Today" },
};

export const Pill: Story = {
  args: { pill: true, tone: "accent", children: "Pill" },
};

// Admission / transfer events: solid = today's event needing action; tint =
// informational status. All pills, all paired with an icon + label.
export const AdmissionEvents: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge fill="solid" tone="info" pill icon={LogIn}>
        Admit Today
      </Badge>
      <Badge fill="solid" tone="warning" pill icon={LogOut}>
        Discharge
      </Badge>
      <Badge tone="info" pill icon={ArrowLeftRight}>
        Transfer
      </Badge>
      <Badge tone="neutral" pill icon={Bed}>
        New Room
      </Badge>
    </div>
  ),
};
