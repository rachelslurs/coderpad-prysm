import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchX } from "lucide-react";
import EmptyState from "./EmptyState";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: { children: "No results match your search." },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithIcon: Story = { args: { icon: SearchX } };
