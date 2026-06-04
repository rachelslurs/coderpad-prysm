import type { Meta, StoryObj } from "@storybook/react-vite";
import OverlayPanel from "./OverlayPanel";
import { Button } from "../Button";

const meta = {
  title: "Overlays/OverlayPanel",
  component: OverlayPanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "An absolutely-positioned overlay that fills its nearest *positioned* ancestor, with the WCAG dialog plumbing: focus moves to its first focusable element on open, and Escape calls `onClose`. The visual surface (background, etc.) is supplied via `className`, so the panel stays context-agnostic.",
          "",
          "**When to use:** a detail/drawer that *covers* a region (e.g. roster → detail), as opposed to a side-by-side split.",
          "",
          "**When not to use:** for inline grouping use **Card**/**Section**.",
          "",
          "Restoring focus to the trigger on close is the **caller's** responsibility (it owns the trigger); the panel only manages focus-in + Escape.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onClose: () => {},
    className: "bg-neutral-50",
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
