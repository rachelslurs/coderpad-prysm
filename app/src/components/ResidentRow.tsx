import type { ReactNode } from "react";
import { Avatar, EntityRow } from "@prysm/design-system";
import type { Patient } from "../../data/patients";
import { formatRoom } from "../lib/format";

type ResidentRowProps = {
  patient: Patient;
  /** Kept for caller compatibility; the row is always the minimal name+room form. */
  minimal?: boolean;
  /** Hide the avatar — the Assignment Selection list shows name + room only, no
   *  picture (and no detail that would let a CNA cherry-pick away from harder
   *  patients). */
  hideAvatar?: boolean;
  /** Trailing slot — a flag or an adjustment control. */
  trailing?: ReactNode;
  /** Makes the whole row an accessible button with a trailing chevron. */
  onPress?: () => void;
};

// The compact name + room row, used by the Assignment Selection list and the
// resident search results. Deliberately minimal — the assignment view uses the
// richer uniform <ResidentCard/> instead.
export default function ResidentRow({ patient, hideAvatar, trailing, onPress }: ResidentRowProps) {
  return (
    <EntityRow
      avatar={hideAvatar ? undefined : <Avatar name={patient.name} size="sm" />}
      title={patient.name}
      subtitle={<>Room {formatRoom(patient.room)}</>}
      trailing={trailing}
      onPress={onPress}
    />
  );
}
