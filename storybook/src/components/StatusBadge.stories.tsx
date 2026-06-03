import type { Meta, StoryObj } from "@storybook/react-vite";
import StatusBadge from "./StatusBadge";

const meta = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["Stable", "Needs Attention", "Critical"],
    },
  },
  args: { status: "Stable" },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Stable: Story = { args: { status: "Stable" } };
export const NeedsAttention: Story = { args: { status: "Needs Attention" } };
export const Critical: Story = { args: { status: "Critical" } };
