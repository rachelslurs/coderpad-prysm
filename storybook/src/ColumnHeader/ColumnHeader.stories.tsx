import type { Meta, StoryObj } from "@storybook/react-vite";
import ColumnHeader from "./ColumnHeader";

const meta = {
  title: "Data Display/ColumnHeader",
  component: ColumnHeader,
  tags: ["autodocs"],
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
