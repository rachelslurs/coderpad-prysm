import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stethoscope } from "lucide-react";
import IconTile from "./IconTile";

const meta = {
  title: "Data Display/IconTile",
  component: IconTile,
  tags: ["autodocs"],
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
