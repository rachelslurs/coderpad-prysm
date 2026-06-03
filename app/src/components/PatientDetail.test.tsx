import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PatientDetail from "./PatientDetail";
import { PATIENTS } from "../../data/patients";

// Margaret Holloway — initials "MH".
const samplePatient = PATIENTS[0];

describe("PatientDetail", () => {
  it("renders the patient's clinical, care, and admin details", () => {
    render(
      <PatientDetail patient={samplePatient} hideNames={false} onClose={() => {}} />
    );
    const panel = screen.getByTestId("detail-panel");
    expect(within(panel).getByText(samplePatient.name)).toBeInTheDocument();
    expect(within(panel).getByText(samplePatient.diagnosis)).toBeInTheDocument();
    expect(within(panel).getByText(samplePatient.physician)).toBeInTheDocument();
    expect(within(panel).getByText(samplePatient.insurance)).toBeInTheDocument();
  });

  it("masks the patient name in privacy mode", () => {
    render(
      <PatientDetail patient={samplePatient} hideNames onClose={() => {}} />
    );
    expect(screen.queryByText(samplePatient.name)).not.toBeInTheDocument();
    // Initials still shown.
    expect(screen.getAllByText("MH").length).toBeGreaterThan(0);
  });

  it("calls onClose when the Back button is clicked", () => {
    const onClose = vi.fn();
    render(
      <PatientDetail patient={samplePatient} hideNames={false} onClose={onClose} />
    );
    fireEvent.click(screen.getByTestId("close-button"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(
      <PatientDetail patient={samplePatient} hideNames={false} onClose={onClose} />
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
