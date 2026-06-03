import type { Meta, StoryObj } from "@storybook/react-vite";
import Toggle from "./Toggle";

const meta = {
  title: "Forms/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  args: { children: "Bathing complete", defaultSelected: true },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const On: Story = {};
export const Off: Story = { args: { defaultSelected: false, children: "Refused care" } };
export const Disabled: Story = {
  args: { isDisabled: true, defaultSelected: true, children: "Isolation precautions" },
};
