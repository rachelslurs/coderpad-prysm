import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { useState } from "react";
import Stepper from "./Stepper";

const meta = {
  title: "Forms/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Structured numeric input — **never freeform**. Two modes share the +/− stepper frame:",
          "",
          '- `mode="input"` — typed **or** stepped (react-aria `NumberField`: clamps, rounds, locale-aware).',
          '- `mode="step"` — step-only spinbutton; supports an unset state ("Not set" until touched) and a `seed` (the last reading) the first +/− jumps to.',
          "",
          "**When to use:** any numeric value — vitals, counts, pain 0–10.",
          "",
          "**When not to use:** for one-of-N labels use **Segmented**; for binary use **Toggle**. Prefer Stepper over a freeform text field for numbers — it clamps, rounds, and keeps values comparable.",
        ].join("\n"),
      },
    },
  },
  args: { label: "Temperature", minValue: 95, maxValue: 105, step: 0.1, unit: "°F" },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Typed: Story = {
  render: (args) => {
    const [v, setV] = useState(98.6);
    return <Stepper {...args} mode="input" value={v} onChange={setV} />;
  },
  // Proves the react-aria NumberField steps + clamps in a real browser.
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole("textbox", { name: "Temperature" });
    await expect(field).toHaveValue("98.6");
    await userEvent.click(canvas.getByRole("button", { name: /increase/i }));
    await expect(field).toHaveValue("98.7");
  },
};

export const StepOnly: Story = {
  args: { label: "Pain level", minValue: 0, maxValue: 10, step: 1, unit: "/ 10" },
  render: (args) => {
    const [v, setV] = useState(4);
    return <Stepper {...args} mode="step" value={v} onChange={setV} />;
  },
};

// Tight-range vital: starts unset ("Not set"); first +/− — or "Use last" —
// seeds from the previous reading.
export const UnsetWithSeed: Story = {
  args: { label: "Temperature", minValue: 95, maxValue: 105, step: 0.1, unit: "°F" },
  render: (args) => {
    const [v, setV] = useState<number | null>(null);
    return <Stepper {...args} mode="step" seed={98.4} value={v} onChange={setV} />;
  },
};
