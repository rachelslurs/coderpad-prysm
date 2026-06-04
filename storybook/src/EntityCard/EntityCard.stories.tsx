import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertOctagon, Footprints, Wind } from "lucide-react";
import EntityCard from "./EntityCard";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { TaskProgress } from "../TaskProgress";
import { Skeleton } from "../Skeleton";

const meta = {
  title: "Data Display/EntityCard",
  component: EntityCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The full-density **entity card** — a leading visual (avatar), a title + supporting line, an optional badge/flag row, and a trailing slot (progress, status, or a loading skeleton), with an optional leading status accent. One of the system's two workhorses; pairs with `EntityRow`.",
          "",
          "**When to use:** the primary, attention-getting representation of a record — a featured cluster, a card grid, or a detail header. Pass `onPress` to make the whole card an accessible, keyboard-operable button.",
          "",
          "**When not to:** dense lists of many records — use `EntityRow`, the compact sibling that renders the *same data* leaner (so a record looks identical across overview, roster, and header). For a plain bordered container with no entity semantics, use `Card`.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof EntityCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const avatar = <Avatar name="Harold Kim" size="lg" />;
const badges = (
  <>
    <Badge size="sm" tone="danger" icon={AlertOctagon}>
      Fall Risk
    </Badge>
    <Badge size="sm" tone="danger" icon={Wind}>
      Aspiration
    </Badge>
    <Badge size="sm" tone="warning" icon={Footprints}>
      Wound Care
    </Badge>
  </>
);

export const Default: Story = {
  args: {
    title: "Harold Kim",
    subtitle: "Room 104C · 68 · M · Sepsis",
    avatar,
    badges,
    accentTone: "danger",
    trailing: <TaskProgress value={2} total={6} variant="ring" size={52} />,
  },
};

export const Clickable: Story = {
  args: { ...Default.args, onPress: () => {} },
};

export const NoBadges: Story = {
  args: {
    title: "Maria Alvarez",
    subtitle: "Room 110A · 74 · F · CHF",
    avatar: <Avatar name="Maria Alvarez" size="lg" />,
    accentTone: "warning",
    trailing: <TaskProgress value={5} total={6} variant="ring" size={52} />,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    trailing: <Skeleton circle width={52} height={52} />,
  },
};
