import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import Toggle from "./Toggle";

const meta = {
  title: "Forms/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Binary on/off switch (react-aria `Switch`: `role=switch`, Space to toggle, announced state). The pill visual is the design-system's.",
          "",
          "**When to use:** a single binary setting/state (Bathing complete, Privacy on/off, Isolation precautions).",
          "",
          "**When not to use:** for one-of-N from a fixed set, use **Segmented**; for a numeric value, use **Stepper**; for an action, use **Button**. Multi-select lists are composed from *several* Toggles — this system has no dedicated multi-select control.",
        ].join("\n"),
      },
    },
  },
  args: { children: "Bathing complete", defaultSelected: true },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const On: Story = {};
export const Off: Story = {
  args: { defaultSelected: false, children: "Refused care" },
  // Proves the react-aria Switch actually toggles in a real browser.
  play: async ({ canvas, userEvent }) => {
    const sw = canvas.getByRole("switch", { name: "Refused care" });
    await expect(sw).not.toBeChecked();
    await userEvent.click(sw);
    await expect(sw).toBeChecked();
  },
};
export const Disabled: Story = {
  args: { isDisabled: true, defaultSelected: true, children: "Isolation precautions" },
};
