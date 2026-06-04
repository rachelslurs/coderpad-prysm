import type { Meta, StoryObj } from "@storybook/react-vite";
import Select from "./Select";

const meta = {
  title: "Forms/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Shift",
    options: ["Day", "Evening", "Night"],
    placeholder: "Pick a shift",
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefault: Story = {
  args: { defaultSelectedKey: "Evening" },
};

export const ObjectOptions: Story = {
  args: {
    label: "Unit",
    options: [
      { value: "1n", label: "1 North" },
      { value: "2s", label: "2 South" },
      { value: "3e", label: "3 East" },
    ],
    placeholder: "Pick a unit",
  },
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
    errorMessage: "Select a shift to continue.",
  },
};

export const Disabled: Story = {
  args: { defaultSelectedKey: "Day", isDisabled: true },
};
