import type { Meta, StoryObj } from "@storybook/react-vite";
import { History } from "lucide-react";
import FormField from "./FormField";
import { Stepper } from "../Stepper";
import { Segmented } from "../Segmented";
import { Toggle } from "../Toggle";

const meta = {
  title: "Forms/FormField",
  component: FormField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { label: "Field", children: null },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

const lastHint = (value: string) => (
  <>
    <History className="h-3 w-3 text-neutral-400" aria-hidden="true" />
    Last <b className="font-extrabold tabular-nums text-neutral-700">{value}</b>
  </>
);

export const Default: Story = {
  args: {
    label: "Heart Rate",
    hint: lastHint("72"),
    children: <Stepper label="Heart rate" mode="step" seed={72} unit="bpm" />,
  },
};

// A divide-y stack of structured fields — the documentation-form pattern.
export const FieldStack: Story = {
  render: () => (
    <div className="max-w-sm divide-y divide-neutral-100 overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <FormField label="Heart Rate" hint={lastHint("72")}>
        <Stepper label="Heart rate" mode="step" seed={72} unit="bpm" />
      </FormField>
      <FormField label="Meal Intake" hint={lastHint("75%")}>
        <Segmented
          label="Meal intake"
          options={["0%", "25%", "50%", "75%", "100%"]}
        />
      </FormField>
      <FormField label="Assistance Needed">
        <Toggle>Two-person assist</Toggle>
      </FormField>
    </div>
  ),
};
