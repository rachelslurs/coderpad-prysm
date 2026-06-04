import { describe, it, expect } from "vitest";
import { buildInitialAssignment } from "./assignment";
import { needsAttention, needsAttentionItems, rosterItems } from "./triage";
import { PATIENTS } from "../../data/patients";

const find = (name: string) => PATIENTS.find((p) => p.name.startsWith(name))!;

describe("triage — membership", () => {
  it("flagged residents need attention (a time-sensitive task counts)", () => {
    expect(needsAttention(find("Margaret"))).toBe(true); // elopement + time-sensitive
    expect(needsAttention(find("Henry"))).toBe(true); // time-sensitive task only
  });

  it("unflagged residents don't", () => {
    expect(needsAttention(find("James"))).toBe(false);
  });
});

describe("triage — ordering", () => {
  const items = buildInitialAssignment();

  it("sorts by most-urgent flag, then soonest task, then room", () => {
    const order = rosterItems(items).map((i) => i.patient.name.split(" ")[0]);
    expect(order).toEqual([
      "Margaret", // elopement (rank 4)
      "Dorothy", // aspiration (rank 3), task due 10m
      "Rosa", // time-sensitive (rank 3), task due 30m
      "Henry", // time-sensitive (rank 3), task due 90m
      "Walter", // wound care (rank 2)
      "Lucia", // unflagged, task due 35m
      "James", // unflagged, task due 60m
      "Sam", // unflagged, no task
    ]);
  });

  it("the cluster is exactly the flagged residents, same order", () => {
    const cluster = needsAttentionItems(items).map((i) => i.patient.name.split(" ")[0]);
    expect(cluster).toEqual(["Margaret", "Dorothy", "Rosa", "Henry", "Walter"]);
  });
});
