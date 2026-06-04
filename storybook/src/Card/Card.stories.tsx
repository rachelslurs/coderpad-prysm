import type { Meta, StoryObj } from "@storybook/react-vite";
import Card from "./Card";

const meta = {
  title: "Data Display/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Generic bordered white surface (`rounded-md border bg-white shadow-sm`) with no domain knowledge — the container panels, lists, and tiers sit in.",
          "",
          "**When to use:** to group related content on a raised surface.",
          "",
          "**When not to use:** for a labelled content group with an eyebrow heading and *no* border, use **Section**; for a small labelled status chip, use **Badge**.",
          "",
          '**Padding:** `padding="none"` for list rows that own their own padding (e.g. a `divide-y` list — see the NoPadding story); `md` (default) for normal cards; `sm` for compact ones.',
          "",
          "Use `as` to render a semantic element (`section`, `article`, `li`) instead of the default `div`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    padding: { control: "inline-radio", options: ["none", "sm", "md"] },
  },
  args: { padding: "md", children: "Card content" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoPadding: Story = {
  args: {
    padding: "none",
    className: "divide-y divide-neutral-100",
    children: (
      <>
        <div className="p-4">First row</div>
        <div className="p-4">Second row</div>
      </>
    ),
  },
};
