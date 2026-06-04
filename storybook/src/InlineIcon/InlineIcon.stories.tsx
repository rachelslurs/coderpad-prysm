import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Check, Circle, Square } from "lucide-react";
import InlineIcon from "./InlineIcon";

const meta = {
  title: "Layout/Icon with Text",
  component: InlineIcon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "The **InlineIcon** layout primitive (\"Icon with Text\", after [Every Layout](https://every-layout.dev/layouts/icon/)). Inline-sizes a glyph to the surrounding text's *cap height*, so an icon always matches its line — at any font size.",
          "",
          "Named for its one job: a glyph that lives **inline with text**. The glyph comes from the design system's icon set (**lucide-react**) — pass it as the `icon` prop, the same `LucideIcon` type Badge and IconTile take. `space` is a spacing token; the icon inherits color via `currentColor`, so a `text-*` class on `className` tints it.",
          "",
          "**Accessibility:** pass `label` to expose the icon as a named image; otherwise it's decorative and `aria-hidden`. Pair meaningful icons with visible text — never rely on the glyph alone.",
          "",
          "**When to use:** an inline glyph that should track the text it sits in — in buttons, list bullets, links, prose.",
          "",
          "**When not to use:** for a standalone, *tinted* icon chip with no surrounding text, use **IconTile**. For a fixed-size chrome/button glyph that doesn't scale with text, render the lucide icon directly.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    icon: { control: false },
    space: { control: "select", options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12] },
    label: { control: "text" },
  },
  args: { icon: Circle, space: 1 },
} satisfies Meta<typeof InlineIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InText: Story = {
  render: (args) => (
    <p className="text-base">
      Sized to <InlineIcon {...args} icon={Circle} />
      cap height — even at{" "}
      <span className="text-3xl">
        large <InlineIcon {...args} icon={Square} />
      </span>{" "}
      sizes.
    </p>
  ),
};

export const InButton: Story = {
  render: () => (
    <button className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-white">
      <InlineIcon icon={ArrowRight} space={2} />
      Next
    </button>
  ),
};

export const LabeledFeatureList: Story = {
  render: () => (
    <ul className="flex list-none flex-col gap-2 p-0">
      {["Unlimited layout primitives", "Container-query support", "Print-quality export"].map((f) => (
        <li key={f} className="flex items-baseline text-base">
          <InlineIcon icon={Check} space={2} label="Included" className="shrink-0 text-accent-600" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  ),
};
