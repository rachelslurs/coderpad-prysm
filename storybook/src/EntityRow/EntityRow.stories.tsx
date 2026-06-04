import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertOctagon } from "lucide-react";
import EntityRow from "./EntityRow";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { Skeleton } from "../Skeleton";
import type { Tone } from "../types";

const meta = {
  title: "Data Display/EntityRow",
  component: EntityRow,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The compact, list-density sibling of `EntityCard` — identical data, leaner layout. Owns no divider, so stack rows inside a `divide-y` list on a surface.",
          "",
          "**When to use:** rosters and scannable lists where many records share the screen. Pass `onPress` for an accessible, keyboard-navigable row with a trailing chevron.",
          "",
          "**When not to:** a single featured record or a detail header — use `EntityCard`. For a generic clickable list item without the avatar / title / meta structure, build on `Card` or a plain button.",
        ].join("\n"),
      },
    },
  },
  args: { title: "Resident" },
} satisfies Meta<typeof EntityRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const count = (done: number, total: number) => (
  <span className="text-sm font-extrabold tabular-nums text-neutral-600">
    {done}
    <span className="mx-0.5 text-neutral-400">/</span>
    <span className="text-neutral-500">{total}</span>
  </span>
);

export const Default: Story = {
  args: {
    title: "Harold Kim",
    subtitle: "Room 104C · 68M · Sepsis",
    avatar: <Avatar name="Harold Kim" size="md" />,
    accentTone: "danger",
    trailing: count(2, 6),
    onPress: () => {},
  },
};

const ROSTER: {
  name: string;
  meta: string;
  tone: Tone;
  done: number;
  flag?: string;
}[] = [
  { name: "Harold Kim", meta: "Room 104C · 68M · Sepsis", tone: "danger", done: 2, flag: "Fall Risk" },
  { name: "Maria Alvarez", meta: "Room 110A · 74F · CHF", tone: "warning", done: 5 },
  { name: "James Okafor", meta: "Room 112B · 81M · Stroke recovery", tone: "neutral", done: 6 },
];

// Rows are designed to sit in a divide-y list on a white surface.
export const Roster: Story = {
  render: () => (
    <div className="divide-y divide-neutral-100 overflow-hidden border border-neutral-200 bg-white">
      {ROSTER.map((r) => (
        <EntityRow
          key={r.name}
          title={r.name}
          subtitle={r.meta}
          avatar={<Avatar name={r.name} size="md" />}
          accentTone={r.tone}
          badges={
            r.flag ? (
              <Badge size="sm" tone="danger" icon={AlertOctagon}>
                {r.flag}
              </Badge>
            ) : undefined
          }
          trailing={count(r.done, 6)}
          onPress={() => {}}
        />
      ))}
    </div>
  ),
};

export const Loading: Story = {
  args: {
    title: "Harold Kim",
    subtitle: "Room 104C · 68M · Sepsis",
    avatar: <Avatar name="Harold Kim" size="md" />,
    accentTone: "danger",
    trailing: <Skeleton width={30} height={16} radius={5} />,
  },
};
