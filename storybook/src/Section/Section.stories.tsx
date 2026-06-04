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
          'A labelled group of content — a small uppercase eyebrow heading + body, with *no* border or surface of its own. The "tier" pattern, generalized.',
          "",
          "**When to use:** group content under an eyebrow heading (CARE CONTEXT, ADMIN). Omit `title` for an unlabelled group.",
          "",
          "**When not to use:** when you need a bordered/raised surface, use **Card** (or compose Section *inside* a Card).",
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
