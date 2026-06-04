import type { Meta, StoryObj } from "@storybook/react-vite";
import TextArea from "./TextArea";

const meta = {
  title: "Forms/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { label: "Notes", placeholder: "Add a note…" },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    label: "Notes",
    rows: 5,
    description: "Visible to the next shift.",
  },
};

export const Invalid: Story = {
  args: {
    label: "Notes",
    isInvalid: true,
    errorMessage: "This field is required.",
  },
};

export const Disabled: Story = {
  args: { label: "Notes", defaultValue: "Locked entry", isDisabled: true },
};
