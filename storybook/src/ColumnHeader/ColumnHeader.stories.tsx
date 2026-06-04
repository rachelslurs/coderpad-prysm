import type { Meta, StoryObj } from "@storybook/react-vite";
import ColumnHeader from "./ColumnHeader";

const meta = {
  title: "Data Display/ColumnHeader",
  component: ColumnHeader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          'A table column header (`<th scope="col">`). Static by default; pass `onSort` to make it sortable — which adds the **SortIndicator**, `aria-sort`, and Enter/Space + click across the whole cell.',
          "",
          "**When to use:** the header cells of a data table.",
          "",
          "**When not to use:** outside a `<table>` — it renders a `<th>` and needs table context (the stories wrap it in one).",
        ].join("\n"),
      },
    },
  },
  // A <th> needs table context to be valid.
  decorators: [
    (Story) => (
      <table className="border-collapse">
        <thead>
          <tr>
            <Story />
          </tr>
        </thead>
      </table>
    ),
  ],
  args: { children: "Room" },
} satisfies Meta<typeof ColumnHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {};

export const SortableActive: Story = {
  args: { onSort: () => {}, active: true, direction: "asc", children: "Room" },
};

export const SortableInactive: Story = {
  args: { onSort: () => {}, active: false, children: "Patient" },
};
