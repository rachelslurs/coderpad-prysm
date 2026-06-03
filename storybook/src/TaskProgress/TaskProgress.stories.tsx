import type { Meta, StoryObj } from "@storybook/react-vite";
import TaskProgress from "./TaskProgress";

const meta = {
  title: "Data Display/TaskProgress",
  component: TaskProgress,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["ring", "bar"] },
    tone: {
      control: "inline-radio",
      options: ["neutral", "accent", "info", "success", "warning", "danger"],
    },
  },
  args: { value: 3, total: 6, variant: "ring", tone: "accent" },
} satisfies Meta<typeof TaskProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ring: Story = {};
export const Bar: Story = {
  args: { variant: "bar", label: "Tasks" },
  render: (args) => (
    <div className="w-64">
      <TaskProgress {...args} />
    </div>
  ),
};
export const Complete: Story = { args: { value: 6, total: 6, tone: "success" } };
