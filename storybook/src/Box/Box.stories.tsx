import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "./Box";

const meta = {
  title: "Layout/Box",
  component: Box,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "The **Box** layout primitive (after [Every Layout](https://every-layout.dev/layouts/box/)). The simplest unit of containment: padding + a border, and nothing else.",
          "",
          "`padding` and `borderWidth` are **scale tokens** (the system's Tailwind steps), not raw lengths. It's deliberately *unstyled by color*: the border is a solid `currentColor` line and there's no background, so theme classes passed via `className` win — no specificity fight.",
          "",
          "**When to use:** the moment content alone isn't enough to suggest its own bounds — callouts, notes, banners, the inner shell of a card. (**Card** is built on Box.)",
          "",
          "**When not to use:** for a ready-made *raised white surface* with rounded corners and a shadow, use **Card**. For a labelled content group with an eyebrow heading, use **Section**.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    padding: { control: "select", options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12] },
    borderWidth: { control: "inline-radio", options: [0, 1, 2, 4, 8] },
    invert: { control: "boolean" },
  },
  args: {
    padding: 6,
    borderWidth: 1,
    children: "A box is padding, a border, and nothing more.",
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Theme classes passed via className win over the bare base.
export const Themed: Story = {
  args: {
    className: "border-accent-200 bg-accent-50 text-accent-900 rounded-md",
    children: "Box + theme classes: the accent surface wins, no inline-style fight.",
  },
};

export const ThickBorder: Story = {
  args: { borderWidth: 4, padding: 4, children: "borderWidth: 4" },
};

export const Nested: Story = {
  args: {
    className: "bg-neutral-50",
    children: (
      <Box padding={3} className="bg-white">
        Boxes nest — reach for them whenever a region needs explicit bounds.
      </Box>
    ),
  },
};
