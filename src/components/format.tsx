// Small UI helpers shared by PatientCensus (roster row) and PatientDetail (panel hero).
// Returns JSX in formatRoom's case, so the file is .tsx.

// "101A" → bold digits + lighter suffix. Room number is the scan target; the wing
// letter is supporting detail.
export const formatRoom = (room: string) => {
  const match = room.match(/^(\d+)([A-Za-z]*)$/);
  if (!match) return <>{room}</>;
  const [, digits, suffix] = match;
  return (
    <>
      <span className="font-black">{digits}</span>
      {suffix && <span className="ml-0.5 font-normal">{suffix}</span>}
    </>
  );
};

export const toInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase())
    .join("");

// Length-of-stay derived from today. The fixture's 2024 admit dates yield large
// counts in 2026 — magnitude isn't the point, the "Day N" cue is. In a real
// system the fixture would be seeded from `now - N days`.
//
// Manual y/m/d split: `new Date("YYYY-MM-DD")` parses as UTC midnight and drifts
// a day west of GMT. Constructing locally avoids the off-by-one.
export const calculateLOS = (admittedOn: string) => {
  const [year, month, day] = admittedOn.split("-").map(Number);
  const admit = new Date(year, month - 1, day);
  admit.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.max(
    0,
    Math.floor((today.getTime() - admit.getTime()) / 86_400_000)
  );
  const dateStr = admit.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return { days, dateStr };
};
