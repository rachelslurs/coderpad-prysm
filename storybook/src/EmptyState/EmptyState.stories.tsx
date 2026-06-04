import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchX } from "lucide-react";
import EmptyState from "./EmptyState";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          'Centered "nothing here" message (`role=status`, so it\'s announced when results disappear — e.g. a filter clears the list).',
          "",
          "**When to use:** a list/region has no content to show.",
          "",
          "**When not to use:** while content is still *loading*, use **Skeleton** instead — an empty state implies the load finished with nothing.",
        ].join("\n"),
      },
    },
  },
  args: { children: "No results match your search." },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithIcon: Story = { args: { icon: SearchX } };
