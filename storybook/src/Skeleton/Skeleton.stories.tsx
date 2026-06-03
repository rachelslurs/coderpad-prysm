import type { Meta, StoryObj } from "@storybook/react-vite";
import Skeleton from "./Skeleton";

const meta = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  args: { width: 240, height: 16 },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {};
export const Circle: Story = { args: { circle: true, height: 48, width: 48 } };

// A compact resident-row placeholder, composed from the primitive.
export const ResidentRow: Story = {
  render: () => (
    <div className="flex max-w-md items-center gap-3 border border-neutral-200 p-4">
      <Skeleton circle height={44} />
      <div className="flex-1 space-y-2">
        <Skeleton width="50%" height={15} />
        <Skeleton width="70%" height={11} />
      </div>
      <Skeleton width={30} height={16} />
    </div>
  ),
};
