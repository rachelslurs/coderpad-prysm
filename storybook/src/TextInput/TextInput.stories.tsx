import type { Meta, StoryObj } from "@storybook/react-vite";
import TextInput from "./TextInput";

const meta = {
  title: "Forms/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { label: "Full name", placeholder: "Jane Doe" },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    label: "Work email",
    type: "email",
    placeholder: "you@example.com",
    description: "We'll only use this for shift notifications.",
  },
};

export const Invalid: Story = {
  args: {
    label: "Work email",
    type: "email",
    defaultValue: "not-an-email",
    isInvalid: true,
    errorMessage: "Enter a valid email address.",
  },
};

export const Disabled: Story = {
  args: { label: "Facility", defaultValue: "Cedar Ridge SNF", isDisabled: true },
};
