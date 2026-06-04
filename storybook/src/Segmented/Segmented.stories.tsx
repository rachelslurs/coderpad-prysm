import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { useState } from "react";
import Segmented from "./Segmented";

const ADL = ["None", "Assist ×1", "Assist ×2", "Total"];
const INTAKE = ["0%", "25%", "50%", "75%", "100%", "Refused"];

const meta = {
  title: "Forms/Segmented",
  component: Segmented,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Single-select only** — an exclusive radio group (one choice at a time), built on react-aria `RadioGroup`. The *name* doesn't imply this, so state it plainly: selecting a new option deselects the previous one.",
          "",
          "**When to use:** choose exactly one value from a small, fixed set (ADL level, meal intake %).",
          "",
          "**When not to use:** **there is no multi-select control** in this system — for multi-select, compose several **Toggle**s (one per option). For a free numeric value use **Stepper**; for binary on/off use **Toggle**; for an action use **Button**.",
          "",
          "**Variants (both single-select):** `segmented` = compact thumb track, best for 2–4 short options; `picker` = wrapped chips with a check badge, for longer or more numerous options.",
        ].join("\n"),
      },
    },
  },
  args: { label: "ADL level", variant: "segmented", options: ADL },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SegmentedControl: Story = {
  render: (args) => {
    const [v, setV] = useState("Assist ×1");
    return <Segmented {...args} options={ADL} value={v} onChange={setV} />;
  },
  // Proves the react-aria RadioGroup selects in a real browser.
  play: async ({ canvas, userEvent }) => {
    const total = canvas.getByRole("radio", { name: "Total" });
    await expect(total).not.toBeChecked();
    await userEvent.click(total);
    await expect(total).toBeChecked();
  },
};

export const Picker: Story = {
  args: { variant: "picker", label: "Meal intake" },
  render: (args) => {
    const [v, setV] = useState("50%");
    return <Segmented {...args} options={INTAKE} value={v} onChange={setV} />;
  },
};
