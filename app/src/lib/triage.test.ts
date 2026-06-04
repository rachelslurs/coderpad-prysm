import { describe, it, expect } from "vitest";
import { buildInitialAssignment } from "./assignment";
import { rosterItems } from "./triage";

describe("triage — sort order", () => {
  const items = buildInitialAssignment();

  it("orders by time-sensitive, then alert, then room", () => {
    const order = rosterItems(items).map((i) => i.patient.name.split(" ")[0]);
    expect(order).toEqual([
      "Margaret", // time-sensitive (107A)
      "Rosa", //     time-sensitive (112B)
      "Henry", //    time-sensitive (115A)
      "Dorothy", //  fall-risk alert (101A)
      "Pearl", //    fall-risk alert (122A)
      "Walter", //   routine, by room (103B)
      "James", //    110A
      "Lucia", //    118A
      "Sam", //      120B
      "Arthur", //   124B
    ]);
  });
});
