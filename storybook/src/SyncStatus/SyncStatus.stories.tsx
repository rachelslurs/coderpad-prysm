import type { Meta, StoryObj } from "@storybook/react-vite";
import SyncStatus from "./SyncStatus";
import type { SyncState } from "./SyncStatus";

const STATES: SyncState[] = ["saved", "saving", "queued", "failed"];

const meta = {
  title: "Feedback/SyncStatus",
  component: SyncStatus,
  tags: ["autodocs"],
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
