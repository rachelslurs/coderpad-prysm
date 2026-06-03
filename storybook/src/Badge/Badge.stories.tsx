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
