import type { Meta, StoryObj } from "@storybook/react-vite";
import Avatar from "./Avatar";

const meta = {
  title: "Data Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
  args: { name: "Margaret Holloway", size: "md" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};
export const Photo: Story = {
  args: { src: "https://i.pravatar.cc/120?img=47", name: "Robert Simmons" },
};
export const IconFallback: Story = { args: { name: undefined } };
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar name="Rachel Simmons" size="sm" />
      <Avatar name="Rachel Simmons" size="md" />
      <Avatar name="Rachel Simmons" size="lg" />
    </div>
  ),
};
