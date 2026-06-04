import type { Meta, StoryObj } from "@storybook/react-vite";
import Section from "./Section";

const meta = {
  title: "Data Display/Section",
  component: Section,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          'A labelled group of content — a small uppercase eyebrow heading + body, with *no* border or surface of its own. The "tier" pattern, generalized. With a `count` it becomes a section header — a tone dot, the label, a count pill, and a trailing rule (e.g. "Needs attention · 3").',
          "",
          "**When to use:** group content under an eyebrow heading (CARE CONTEXT, ADMIN), or a cluster header that shows how many items follow. Omit `title` for an unlabelled group.",
          "",
          "**When not to use:** when you need a bordered/raised surface, use **Card** (or compose Section *inside* a Card); for the top-of-page / app bar, use **AppBar**.",
        ].join("\n"),
      },
    },
  },
  args: {
    title: "Care Context",
    children: <p className="text-neutral-700">Section body content.</p>,
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Titled: Story = {};
export const Untitled: Story = { args: { title: undefined } };

// Section header: leading dot + label + count pill + trailing rule.
export const WithCount: Story = {
  args: {
    title: "Needs attention",
    count: 3,
    tone: "danger",
    children: <p className="text-neutral-700">Cluster of cards goes here.</p>,
  },
};

export const WithCountNeutral: Story = {
  args: {
    title: "Full assignment",
    count: 12,
    tone: "neutral",
    children: <p className="text-neutral-700">Roster goes here.</p>,
  },
};
