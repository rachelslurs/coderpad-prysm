import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Segmented from "./Segmented";

const meta = {
  title: "Forms/Segmented",
  component: Segmented,
  tags: ["autodocs"],
  args: { label: "ADL level", variant: "segmented" },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

const ADL = ["None", "Assist ×1", "Assist ×2", "Total"];
const INTAKE = ["0%", "25%", "50%", "75%", "100%", "Refused"];

export const SegmentedControl: Story = {
  render: (args) => {
    const [v, setV] = useState("Assist ×1");
    return <Segmented {...args} options={ADL} value={v} onChange={setV} />;
  },
};

export const Picker: Story = {
  args: { variant: "picker", label: "Meal intake" },
  render: (args) => {
    const [v, setV] = useState("50%");
    return <Segmented {...args} options={INTAKE} value={v} onChange={setV} />;
  },
};
