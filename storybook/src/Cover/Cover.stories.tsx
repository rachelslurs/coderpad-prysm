import type { Meta, StoryObj } from "@storybook/react-vite";
import Cover from "./Cover";

const meta = {
  title: "Layout/Cover",
  component: Cover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "The **Cover** layout primitive (after [Every Layout](https://every-layout.dev/layouts/cover/)). A vertical region with a guaranteed minimum height that pins a *centred* element to the middle, with optional satellites (a header, a footer) above and below.",
          "",
          "Mark the centred child with `data-cover-center`. The base is pure Tailwind (flex column + a centred-child `my-auto` rule that reads CSS variables for `space` and `minHeight`); `className` is appended last and wins.",
          "",
          "**When to use:** full-height heroes, empty states, splash/landing regions, sign-in screens — anywhere one thing should sit dead-centre with chrome hugging the edges.",
          "",
          "**When not to use:** for evenly-spaced flow content with no centred focal point, use a simple stack. To centre purely *horizontally* and clamp width, use **Center**.",
          "",
          "`minHeight` defaults to `100vh`; `space` controls both the gap and the padding (unless `noPad`).",
        ].join("\n"),
      },
    },
    layout: "fullscreen",
  },
  argTypes: {
    space: { control: "select", options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12] },
    minHeight: { control: "inline-radio", options: ["screen", "dvh", "svh", "full", "none"] },
    noPad: { control: "boolean" },
  },
  // `full` fills the fixed-height demo frame below; in real use the default is
  // `screen` (a full-viewport cover).
  args: { minHeight: "full", className: "border border-neutral-200 bg-neutral-50" },
  decorators: [
    (Story) => (
      <div className="h-[360px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Cover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <div className="text-xs uppercase tracking-widest text-neutral-500">Header satellite</div>
        <div data-cover-center className="text-center text-2xl font-medium">
          Primary content — vertically centred.
        </div>
        <div className="text-center text-sm text-neutral-500">Footer satellite</div>
      </>
    ),
  },
};

export const EmptyState: Story = {
  args: {
    children: (
      <>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-500">
          <span>Inbox · Drafts</span>
          <span>⌘ N · new draft</span>
        </div>
        <div data-cover-center className="flex flex-col items-center gap-2 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-accent-50 text-accent-900">∅</div>
          <div className="text-2xl font-medium">No drafts yet.</div>
          <p className="max-w-[26ch] text-neutral-500">
            Start one and it'll live here, autosaved every keystroke, forever.
          </p>
          <button className="mt-2 rounded-md bg-accent-600 px-4 py-2 text-white">Start a draft →</button>
        </div>
        <div className="text-center text-sm text-neutral-500">Tip: paste a URL to import an existing page.</div>
      </>
    ),
  },
};
