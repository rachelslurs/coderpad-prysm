import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stethoscope } from "lucide-react";
import IconField from "./IconField";

const meta = {
  title: "Data Display/IconField",
  component: IconField,
  tags: ["autodocs"],
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
