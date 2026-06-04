import type { Meta, StoryObj } from "@storybook/react-vite";
import TextArea from "./TextArea";

const meta = {
  title: "Forms/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A multi-line **freeform** text field (react-aria) — same chrome as `TextInput`, vertically resizable.",
          "",
          "**When to use:** longer freeform prose — notes, comments, handoff detail.",
          "",
          "**When not to:** single-line values → `TextInput`; any value with a known shape (number, choice, boolean) → `Stepper` / `Select` / `Segmented` / `Toggle`.",
        ].join("\n"),
      },
    },
  },
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
