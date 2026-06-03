import type { Meta, StoryObj } from "@storybook/react-vite";
import OverlayPanel from "./OverlayPanel";
import { Button } from "../Button";

const meta = {
  title: "Organisms/OverlayPanel",
  component: OverlayPanel,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    onClose: () => {},
    className: "bg-slate-50",
    children: (
      <div className="space-y-4 p-6">
        <Button variant="ghost">Close</Button>
        <p className="text-neutral-700">
          Fills its nearest positioned ancestor. Focus moves here on open; Escape
          calls onClose.
        </p>
      </div>
    ),
  },
  // The panel is `absolute inset-0`, so host it in a positioned, sized box.
  decorators: [
    (Story) => (
      <div className="relative h-[420px] w-full max-w-md border border-neutral-200">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OverlayPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
