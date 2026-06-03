import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Stepper from "./Stepper";

const meta = {
  title: "Forms/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  args: { label: "Temperature", minValue: 95, maxValue: 105, step: 0.1, unit: "°F" },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Typed: Story = {
  render: (args) => {
    const [v, setV] = useState(98.6);
    return <Stepper {...args} mode="input" value={v} onChange={setV} />;
  },
};

export const StepOnly: Story = {
  args: { label: "Pain level", minValue: 0, maxValue: 10, step: 1, unit: "/ 10" },
  render: (args) => {
    const [v, setV] = useState(4);
    return <Stepper {...args} mode="step" value={v} onChange={setV} />;
  },
};
