import type { Meta, StoryObj } from "@storybook/react-vite";
import PatientDetail from "./PatientDetail";
import { samplePatient } from "../lib/samplePatient";

const meta = {
  title: "Components/PatientDetail",
  component: PatientDetail,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    patient: samplePatient,
    hideNames: false,
    onClose: () => {},
  },
  // The panel is `absolute inset-0`, so give it a positioned, sized host.
  decorators: [
    (Story) => (
      <div className="relative h-[680px] w-full max-w-md border border-slate-200">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PatientDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Critical: Story = {
  args: {
    patient: { ...samplePatient, status: "Critical", diagnosis: "Sepsis" },
  },
};

export const PrivacyMode: Story = {
  args: { hideNames: true },
};
