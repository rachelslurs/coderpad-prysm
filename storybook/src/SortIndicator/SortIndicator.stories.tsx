import type { Meta, StoryObj } from "@storybook/react-vite";
import SortIndicator from "./SortIndicator";

const meta = {
  title: "Data Display/SortIndicator",
  component: SortIndicator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Stacked up/down chevrons; the active direction lights up (accent), the other stays muted — both always visible. Purely decorative (`aria-hidden`).",
          "",
          "**When to use:** inside a custom sortable surface to show sort state. Usually you don't need it directly — **ColumnHeader** renders it for you when `onSort` is set.",
          "",
          "**When not to use:** standalone as the *only* sort signal — sort state must also be conveyed semantically (ColumnHeader sets `aria-sort`).",
        ].join("\n"),
      },
    },
  },
  argTypes: { dir: { control: "inline-radio", options: ["asc", "desc"] } },
  args: { active: true, dir: "asc" },
} satisfies Meta<typeof SortIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ascending: Story = { args: { active: true, dir: "asc" } };
export const Descending: Story = { args: { active: true, dir: "desc" } };
export const Inactive: Story = { args: { active: false } };
