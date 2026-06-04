import type { Meta, StoryObj } from "@storybook/react-vite";
import Field from "./Field";

const meta = {
  title: "Data Display/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Label-over-value pair — the smallest unit of a detail/spec display (a small muted label above a bold value).",
          "",
          "**When to use:** present a single read-only datum with its label (Attending Physician → Dr. Patel).",
          "",
          "**When not to use:** when the row should lead with a tinted icon chip, use **IconField** (Field + IconTile). For *editable* values use a form control — **Stepper** (numbers), **Segmented** (one-of-N), **Toggle** (binary).",
          "",
          "**`size`:** `md` (default) or `lg` for a hero value (a primary heading-scale value).",
        ].join("\n"),
      },
    },
  },
  argTypes: { size: { control: "inline-radio", options: ["md", "lg"] } },
  args: { label: "Attending Physician", size: "md", children: "Dr. Sandra Patel" },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hero: Story = {
  args: { label: "Primary Diagnosis", size: "lg", children: "Sepsis" },
};
