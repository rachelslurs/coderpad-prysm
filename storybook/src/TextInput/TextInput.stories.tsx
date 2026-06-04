import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "lucide-react";
import TextInput from "./TextInput";

const meta = {
  title: "Forms/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A single-line **freeform** text field (react-aria) with label, description, and validation wiring.",
          "",
          "**When to use:** genuinely freeform short text — names, emails, search.",
          "",
          "**When not to — prefer a structured control** (more reliable, faster to complete): numbers → `Stepper`; a small set of exclusive options → `Segmented` (or its picker variant); one choice from a longer list → `Select`; a boolean → `Toggle`; multi-line prose → `TextArea`.",
        ].join("\n"),
      },
    },
  },
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

// Leading icon — adornment inside the field.
export const WithIcon: Story = {
  args: {
    label: undefined,
    "aria-label": "Search",
    placeholder: "Search…",
    icon: Search,
  },
};

// Trailing slot — the consumer composes a clear button, shortcut hint, etc.
export const Clearable: Story = {
  args: {
    label: undefined,
    "aria-label": "Search",
    placeholder: "Search…",
    icon: Search,
    defaultValue: "Margaret",
    trailing: (
      <button
        type="button"
        aria-label="Clear"
        className="rounded text-neutral-400 hover:text-neutral-600"
      >
        ✕
      </button>
    ),
  },
};

// Dark tone — for command bars (e.g. the census header).
export const Dark: Story = {
  parameters: { backgrounds: { default: "dark" } },
  decorators: [
    (Story) => (
      <div className="w-80 rounded-lg bg-neutral-900 p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    label: undefined,
    "aria-label": "Search",
    placeholder: "Find patient…",
    tone: "dark",
    icon: Search,
  },
};
