import type { Meta, StoryObj } from "@storybook/react-vite";
import SortIndicator from "./SortIndicator";

const meta = {
  title: "Atoms/SortIndicator",
  component: SortIndicator,
  tags: ["autodocs"],
  argTypes: { dir: { control: "inline-radio", options: ["asc", "desc"] } },
  args: { active: true, dir: "asc" },
} satisfies Meta<typeof SortIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ascending: Story = { args: { active: true, dir: "asc" } };
export const Descending: Story = { args: { active: true, dir: "desc" } };
export const Inactive: Story = { args: { active: false } };
