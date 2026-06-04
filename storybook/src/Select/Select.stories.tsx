import type { Meta, StoryObj } from "@storybook/react-vite";
import Select from "./Select";

const meta = {
  title: "Forms/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A single-select **dropdown** (react-aria) — a listbox popover with typeahead and keyboard nav, plus label / validation wiring. Accepts string or `{ value, label }` options.",
          "",
          "**When to use:** choosing one value from a longer list (~5+), or when the options should stay collapsed to save space.",
          "",
          "**When not to:** a short set of exclusive options that benefit from being all visible → `Segmented` (or its picker variant); a boolean → `Toggle`; free text → `TextInput`. Multi-select is not supported here.",
        ].join("\n"),
      },
    },
  },
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
