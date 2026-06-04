import type { Meta, StoryObj } from "@storybook/react-vite";
import AppBar from "./AppBar";
import { Button } from "../Button";
import { SyncStatus } from "../SyncStatus";

const meta = {
  title: "Navigation/AppBar",
  component: AppBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "A minimal, slot-based **top bar**: `start` (brand / title / back), an optional center slot, and `end` (actions, pushed right), in a `dark` command-bar tone or a `light` header tone.",
          "",
          "**When to use:** the top chrome of a page or app — compose tabs, menus, a `SyncStatus`, or buttons into the slots. Deliberately unopinionated so it fits both simple and rich headers.",
          "",
          "**When not to:** in-page section headings — use `Section`. It intentionally ships no account-menu or nav primitives; compose those into the slots yourself.",
        ].join("\n"),
      },
    },
  },
  argTypes: { tone: { control: "inline-radio", options: ["dark", "light"] } },
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const brand = (
  <span className="flex items-baseline gap-2">
    <span className="text-lg font-extrabold tracking-tight">1 North</span>
    <span className="text-xs font-semibold text-neutral-400">Cedar Ridge</span>
  </span>
);

export const Dark: Story = {
  args: {
    start: brand,
    end: <SyncStatus state="saved" note="just now" />,
  },
};

export const Light: Story = {
  args: {
    tone: "light",
    start: <span className="text-lg font-extrabold tracking-tight">Dashboard</span>,
    end: <Button size="sm">New</Button>,
  },
};

// Slots compose freely — here a center nav between brand and actions.
export const WithCenterNav: Story = {
  args: {
    start: brand,
    children: (
      <nav className="flex gap-1 text-sm font-semibold text-neutral-400">
        <span className="rounded-md bg-neutral-800 px-3 py-1.5 text-white">
          Assignment
        </span>
        <span className="px-3 py-1.5">Roster</span>
      </nav>
    ),
    end: <SyncStatus state="saving" note="vitals" />,
  },
};
