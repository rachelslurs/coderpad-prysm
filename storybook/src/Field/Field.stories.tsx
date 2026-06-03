import type { Meta, StoryObj } from "@storybook/react-vite";
import Field from "./Field";

const meta = {
  title: "Data Display/Field",
  component: Field,
  tags: ["autodocs"],
  argTypes: { size: { control: "inline-radio", options: ["md", "lg"] } },
  args: { label: "Attending Physician", size: "md", children: "Dr. Sandra Patel" },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hero: Story = {
  args: { label: "Primary Diagnosis", size: "lg", children: "Sepsis" },
};
