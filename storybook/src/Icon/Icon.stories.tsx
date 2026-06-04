import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Check, Circle, Square } from "lucide-react";
import Icon from "./Icon";

const meta = {
  title: "Layout/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "The **Icon** layout primitive (after [Every Layout](https://every-layout.dev/layouts/icon/)). Inline-sizes a glyph to the surrounding text's *cap height*, so an icon always matches its line — at any font size.",
          "",
          "The glyph comes from the design system's icon set (**lucide-react**) — pass it as the `icon` prop, the same `LucideIcon` type Badge and IconTile take. `space` is a spacing token; the icon inherits color via `currentColor`, so a `text-*` class on `className` tints it.",
          "",
          "**Accessibility:** pass `label` to expose the icon as a named image; otherwise it's decorative and `aria-hidden`. Pair meaningful icons with visible text — never rely on the glyph alone.",
          "",
          "**When to use:** any inline glyph that should track the text it sits in — in buttons, list bullets, links, badges.",
          "",
          "**When not to use:** for a standalone, *tinted* icon chip with no surrounding text, use **IconTile**.",
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
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InText: Story = {
  render: (args) => (
    <p className="text-base">
      Sized to <Icon {...args} icon={Circle} />
      cap height — even at{" "}
      <span className="text-3xl">
        large <Icon {...args} icon={Square} />
      </span>{" "}
      sizes.
    </p>
  ),
};

export const InButton: Story = {
  render: () => (
    <button className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-white">
      <Icon icon={ArrowRight} space={2} />
      Next
    </button>
  ),
};

export const LabeledFeatureList: Story = {
  render: () => (
    <ul className="flex list-none flex-col gap-2 p-0">
      {["Unlimited layout primitives", "Container-query support", "Print-quality export"].map((f) => (
        <li key={f} className="flex items-baseline text-base">
          <Icon icon={Check} space={2} label="Included" className="shrink-0 text-accent-600" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  ),
};
