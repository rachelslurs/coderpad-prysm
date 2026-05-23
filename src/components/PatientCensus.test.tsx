import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PatientCensus from "./PatientCensus";
import { PATIENTS } from "../../data/patients";

describe("Patient Census — initial render", () => {
  it("renders a row for every patient", () => {
    render(<PatientCensus />);
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(PATIENTS.length + 1);
  });

  it("renders the unit name", () => {
    render(<PatientCensus />);
    expect(screen.getByText(/1 north/i)).toBeInTheDocument();
  });
});

describe("Patient Census — search", () => {
  it("has a search input", () => {
    render(<PatientCensus />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("filters rows as the user types", () => {
    render(<PatientCensus />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Margaret" } });
    expect(screen.getAllByRole("row")).toHaveLength(2);
  });

  it("filter is case-insensitive", () => {
    render(<PatientCensus />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "margaret" } });
    expect(screen.getByText("Margaret Holloway")).toBeInTheDocument();
  });

  it("shows only the header row when no patients match", () => {
    render(<PatientCensus />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "zzz" } });
    expect(screen.getAllByRole("row")).toHaveLength(1);
  });

  it("restores all patients when the search is cleared", () => {
    render(<PatientCensus />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Harold" } });
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.getAllByRole("row")).toHaveLength(PATIENTS.length + 1);
  });
});

describe("Patient Census — status badge", () => {
  it("does not render status as bare text inside a <td>", () => {
    render(<PatientCensus />);
    screen.getAllByText("Stable").forEach((el) => {
      expect(el.tagName).not.toBe("TD");
    });
  });

  it("renders a badge for each status value", () => {
    render(<PatientCensus />);
    expect(screen.getAllByText("Stable").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Needs Attention").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Critical").length).toBeGreaterThan(0);
  });
});

describe("Patient Census — detail panel", () => {
  it("does not show a detail panel on load", () => {
    render(<PatientCensus />);
    expect(screen.queryByTestId("detail-panel")).not.toBeInTheDocument();
  });

  it("shows a detail panel when a patient row is clicked", () => {
    render(<PatientCensus />);
    fireEvent.click(screen.getByText("Margaret Holloway").closest("tr")!);
    expect(screen.getByTestId("detail-panel")).toBeInTheDocument();
  });

  it("displays the selected patient's clinical details", () => {
    render(<PatientCensus />);
    fireEvent.click(screen.getByText("Harold Kim").closest("tr")!);
    // Side-by-side layout keeps the row visible, so the row's Diagnosis /
    // Physician cells now coexist with the panel's. Scope the assertions to the
    // panel — that's what this test is actually asserting.
    const panel = screen.getByTestId("detail-panel");
    expect(within(panel).getByText(/sepsis/i)).toBeInTheDocument();
    expect(within(panel).getByText(/dr\. aisha brooks/i)).toBeInTheDocument();
    expect(within(panel).getByText(/medicare part a/i)).toBeInTheDocument();
  });

  it("closes the panel when the close button is clicked", () => {
    render(<PatientCensus />);
    fireEvent.click(screen.getByText("Harold Kim").closest("tr")!);
    fireEvent.click(screen.getByTestId("close-button"));
    expect(screen.queryByTestId("detail-panel")).not.toBeInTheDocument();
  });
});
