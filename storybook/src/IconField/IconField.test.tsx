import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Stethoscope } from "lucide-react";
import IconField from "./IconField";

describe("IconField", () => {
  it("renders an icon, label, and value", () => {
    const { container } = render(
      <IconField icon={Stethoscope} label="Physician">
        Dr. Patel
      </IconField>
    );
    expect(container.querySelector("svg[aria-hidden='true']")).toBeTruthy();
    expect(screen.getByText("Physician")).toBeInTheDocument();
    expect(screen.getByText("Dr. Patel")).toBeInTheDocument();
  });
});
