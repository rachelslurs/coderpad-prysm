import type { Meta, StoryObj } from "@storybook/react-vite";
import Sidebar from "./Sidebar";

const meta = {
  title: "Layout/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "The **Sidebar** layout primitive (after [Every Layout](https://every-layout.dev/layouts/sidebar/)). Two adjacent elements — one fixed-width *sidebar*, one fluid *content* column. When the content can't keep its `contentMin` width, the two wrap into a single column, with no media query.",
          "",
          "Pass exactly **two** children in source order; `side` says which is the sidebar. The base is pure Tailwind (flex-wrap + child-targeting rules reading CSS variables); `className` is appended last and wins.",
          "",
          "**When to use:** an avatar beside a byline, a nav rail beside a page, a media thumb beside a caption — any fixed-plus-fluid pair that should collapse gracefully.",
          "",
          "**When not to use:** for many equal, reflowing cells use **Grid**. For width-driven component variants (not just a side rail) use **Container**.",
          "",
          "`sideWidth` sets the rail width (else natural content width); `noStretch` lets the two keep their natural heights.",
        ].join("\n"),
      },
    },
    layout: "padded",
  },
  argTypes: {
    side: { control: "inline-radio", options: ["left", "right"] },
    sideWidth: { control: "select", options: [16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96] },
    contentMin: { control: "inline-radio", options: ["1/2", "3/5", "2/3", "3/4", "full"] },
    space: { control: "select", options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12] },
    noStretch: { control: "boolean" },
  },
  args: { side: "left", sideWidth: 32, contentMin: "3/5", space: 4 },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const Side = ({ children }: { children: React.ReactNode }) => (
  <div className="grid min-h-24 place-items-center bg-accent-50 p-3 text-sm text-accent-900">{children}</div>
);
const Main = ({ children }: { children: React.ReactNode }) => (
  <div className="grid min-h-24 place-items-center bg-neutral-50 p-3 text-sm text-neutral-700">{children}</div>
);

export const Default: Story = {
  render: (args) => (
    <Sidebar {...args}>
      <Side>side</Side>
      <Main>main · grows</Main>
    </Sidebar>
  ),
};

export const RightSide: Story = {
  args: { side: "right" },
  render: (args) => (
    <Sidebar {...args}>
      <Main>main · grows</Main>
      <Side>side</Side>
    </Sidebar>
  ),
};

export const Byline: Story = {
  args: { sideWidth: 20, contentMin: "3/5", space: 4, noStretch: true },
  render: (args) => (
    <Sidebar {...args}>
      <div className="grid aspect-square place-items-center bg-accent-50 text-xs font-medium uppercase tracking-widest text-accent-900">
        M·H
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-lg">Marlowe S. Hahn</div>
        <div className="text-xs uppercase tracking-widest text-neutral-500">Editor-at-large · Layouts Quarterly</div>
        <div className="text-sm text-neutral-600">Writes about CSS, typography, and the long history of the page grid.</div>
      </div>
    </Sidebar>
  ),
};
