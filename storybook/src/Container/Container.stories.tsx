import type { Meta, StoryObj } from "@storybook/react-vite";
import Container from "./Container";

const meta = {
  title: "Layout/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "The **Container** layout primitive (after [Every Layout](https://every-layout.dev/layouts/container/)). Declares a containment context (`container-type: inline-size`) so descendants can respond to *this element's* width with `@container` queries, instead of the viewport's.",
          "",
          "Pair it with Tailwind's container-query variants on the children (`@sm:`, `@lg:`, …) — they query the nearest container, which is this element. `name` is an optional containment identifier; `className` is appended last and wins.",
          "",
          "**When to use:** a component that must adapt to many different slots (a card in a narrow rail vs. a wide row) — width-driven variants without viewport breakpoints.",
          "",
          "**When not to use:** to merely cap and centre a column's width, use **Center**. To place a fixed rail beside fluid content, use **Sidebar**.",
        ].join("\n"),
      },
    },
  },
  argTypes: { name: { control: "text" } },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

// One adaptive card whose layout is driven by the *container's* width via
// Tailwind container-query variants — no viewport breakpoints.
const AdaptiveCard = ({ label }: { label: string }) => (
  <article className="grid gap-3 rounded-md border border-neutral-200 bg-white p-4 @sm:grid-cols-[5rem_1fr] @sm:items-center @lg:grid-cols-[7rem_1fr_auto] @lg:gap-6">
    <div className="aspect-square rounded bg-accent-100" />
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-widest text-neutral-500">Adaptive</span>
      <span className="text-lg">{label}</span>
    </div>
    <button className="hidden self-center rounded-md bg-neutral-900 px-4 py-2 text-white @lg:inline-flex">
      Open
    </button>
  </article>
);

// The same component at three container widths — slim / standard / wide.
export const ThreeContexts: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Container name="card" className="max-w-xs">
        <AdaptiveCard label="Slim mode — stacks." />
      </Container>
      <Container name="card" className="max-w-md">
        <AdaptiveCard label="Standard — art beside body." />
      </Container>
      <Container name="card" className="max-w-2xl">
        <AdaptiveCard label="Wide — an action column appears." />
      </Container>
    </div>
  ),
};
