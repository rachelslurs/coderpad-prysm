// Domain formatting helper for the resident roster (room number). Returns JSX,
// so the file is .tsx. The generic `toInitials` lives in @prysm/design-system.

// "101A" → bold digits + lighter suffix. Room number is the scan target; the wing
// letter is supporting detail.
export const formatRoom = (room: string) => {
  const match = room.match(/^(\d+)([A-Za-z]*)$/);
  if (!match) return <>{room}</>;
  const [, digits, suffix] = match;
  return (
    <>
      <span className="font-bold">{digits}</span>
      {suffix && <span className="ml-0.5 font-normal">{suffix}</span>}
    </>
  );
};
