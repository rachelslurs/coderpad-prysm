import type { Meta, StoryObj } from "@storybook/react-vite";
import SyncStatus from "./SyncStatus";
import type { SyncState } from "./SyncStatus";

const STATES: SyncState[] = ["saved", "saving", "queued", "failed"];

const meta = {
  title: "Feedback/SyncStatus",
  component: SyncStatus,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A per-entry **sync indicator**: one redundant-encoding pill (color + icon + label) for `saved` / `saving` / `queued` / `failed`, with an optional trailing note (timestamp, context). A pre-mapped specialisation of `Badge`.",
          "",
          "**When to use:** surfacing persistence / connectivity confidence for a single item or in a top bar — ambient, glanceable status that never blocks the user.",
          "",
          "**When not to:** for arbitrary labels, categories, or severities use `Badge` directly; for an in-progress *action* (not sync state) prefer a button loading state. Don't also restate the state in prose beside the pill.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    state: { control: "inline-radio", options: STATES },
  },
  args: { state: "saved" },
} satisfies Meta<typeof SyncStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Saving: Story = { args: { state: "saving", note: "vitals · 105A" } };
export const Queued: Story = { args: { state: "queued", note: "offline" } };
export const Failed: Story = { args: { state: "failed", note: "tap to resend" } };

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <SyncStatus state="saved" note="just now" />
      <SyncStatus state="saving" note="vitals · 105A" />
      <SyncStatus state="queued" note="offline" />
      <SyncStatus state="failed" note="tap to resend" />
    </div>
  ),
};
