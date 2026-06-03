import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Field from "./Field";

describe("Field", () => {
  it("renders label and value", () => {
    render(<Field label="Age">82</Field>);
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("82")).toBeInTheDocument();
  });

  it("emphasizes the value at size='lg'", () => {
    render(
      <Field label="Diagnosis" size="lg">
        Sepsis
      </Field>
    );
    expect(screen.getByText("Sepsis").className).toContain("text-3xl");
  });
});
