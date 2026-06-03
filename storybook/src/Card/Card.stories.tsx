import type { Meta, StoryObj } from "@storybook/react-vite";
import Card from "./Card";

const meta = {
  title: "Data Display/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    padding: { control: "inline-radio", options: ["none", "sm", "md"] },
  },
  args: { padding: "md", children: "Card content" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoPadding: Story = {
  args: {
    padding: "none",
    className: "divide-y divide-neutral-100",
    children: (
      <>
        <div className="p-4">First row</div>
        <div className="p-4">Second row</div>
      </>
    ),
  },
};
