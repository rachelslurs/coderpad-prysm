import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLeft, Plus } from "lucide-react";
import Button from "./Button";

const meta = {
  title: "Actions/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["solid", "outline", "ghost"] },
    tone: {
      control: "inline-radio",
      options: ["neutral", "accent", "info", "success", "warning", "danger"],
    },
    size: { control: "inline-radio", options: ["sm", "md"] },
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
