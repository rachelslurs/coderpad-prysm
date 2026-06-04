import type { Meta, StoryObj } from "@storybook/react-vite";
import Center from "./Center";

const meta = {
  title: "Layout/Center",
  component: Center,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "The **Center** layout primitive (after [Every Layout](https://every-layout.dev/layouts/center/)). Horizontally centres a block within its parent and clamps it to a typographic *measure* (`max`).",
          "",
          "The base is pure Tailwind (`mx-auto box-content` + an arbitrary max-width that reads a CSS variable); pass theme classes via `className` and they win.",
          "",
          "**When to use:** to hold prose to a readable line length (Bringhurst's 45–75 characters), or to centre any constrained column.",
          "",
          "**When not to use:** to make a component adapt to its *parent's* size, use **Container** (Center constrains width; Container establishes a query context). To place a fixed-width sidebar next to a fluid column, use **Sidebar**.",
          "",
          "`andText` also centres the text; `gutters` keeps a minimum inline padding; `intrinsic` centres children on their own content width.",
        ].join("\n"),
      },
    },
    layout: "fullscreen",
  },
  argTypes: {
    max: { control: "select", options: ["prose", "xs", "sm", "md", "lg", "xl", "2xl", "full"] },
    gutters: { control: "select", options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12] },
    andText: { control: "boolean" },
    intrinsic: { control: "boolean" },
  },
  args: { max: "sm", children: "Constrain the measure, and prose softens into a column the eye can actually track." },
  decorators: [
    (Story) => (
      <div className="bg-neutral-50 p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Center>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Article: Story = {
  args: {
    max: "sm",
    children: (
      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-medium">On the readable line.</h3>
        <p>
          Bringhurst put it at 45–75 characters; the web rarely lets us argue.
          Constrain the measure, and prose softens into a column the eye can
          actually track. Everything else is decoration.
        </p>
        <p className="text-neutral-500">— from the studio's house style, 6th ed.</p>
      </div>
    ),
  },
};

export const AndText: Story = {
  args: { max: "xs", andText: true, children: "andText centres the text too." },
};

export const Intrinsic: Story = {
  args: {
    max: "xs",
    intrinsic: true,
    children: (
      <button className="rounded-md bg-neutral-900 px-4 py-2 text-white">
        Intrinsically centred on my own width
      </button>
    ),
  },
};
