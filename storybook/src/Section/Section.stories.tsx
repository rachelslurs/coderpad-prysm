import type { Meta, StoryObj } from "@storybook/react-vite";
import Section from "./Section";

const meta = {
  title: "Molecules/Section",
  component: Section,
  tags: ["autodocs"],
  args: {
    title: "Care Context",
    children: <p className="text-neutral-700">Section body content.</p>,
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Titled: Story = {};
export const Untitled: Story = { args: { title: undefined } };
