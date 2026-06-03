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
