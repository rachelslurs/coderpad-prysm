import type { ReactNode } from "react";
import { Avatar, EntityRow, TaskProgress } from "@prysm/design-system";
import type { Patient } from "../../data/patients";
import { signalsFor } from "../../data/residentSignals";
import { formatRoom } from "../lib/format";
import { ageSex, progressTone } from "../lib/residentDisplay";
import { ResidentChips, TransferIcon } from "./residentDisplay";

type ResidentRowProps = {
  patient: Patient;
  /**
   * Review density: name + room only, no triage signals. Used by the Assignment
   * Selection gate, where the CNA is just confirming *who*, not triaging.
   */
  minimal?: boolean;
  /** Trailing slot — overrides the default task-progress ring. */
  trailing?: ReactNode;
  /** Makes the whole row an accessible button with a trailing chevron. */
  onPress?: () => void;
};

// The shared roster-row component, backing the Assignment Selection list and the
// Assignment View roster so the two stay visually consistent. Maps a Patient onto
// the generic <EntityRow/> primitive.
export default function ResidentRow({
  patient,
  minimal = false,
  trailing,
  onPress,
}: ResidentRowProps) {
  if (minimal) {
    return (
      <EntityRow
        avatar={<Avatar name={patient.name} size="sm" />}
        title={patient.name}
        subtitle={<>Room {formatRoom(patient.room)}</>}
        trailing={trailing}
        onPress={onPress}
      />
    );
  }

  const { tasksDone, tasksTotal } = signalsFor(patient.id);

  return (
    <EntityRow
      avatar={<Avatar name={patient.name} size="sm" />}
      title={
        <span className="flex items-center gap-2">
          <span className="font-bold text-neutral-500 tabular-nums">{formatRoom(patient.room)}</span>
          <span>{patient.name}</span>
          <TransferIcon patient={patient} />
        </span>
      }
      subtitle={ageSex(patient)}
      badges={<ResidentChips patient={patient} />}
      trailing={
        trailing ??
        (tasksTotal > 0 ? (
          <TaskProgress
            value={tasksDone}
            total={tasksTotal}
            size={46}
            tone={progressTone(patient)}
            label={`Care tasks: ${tasksDone} of ${tasksTotal} done`}
          />
        ) : undefined)
      }
      onPress={onPress}
    />
  );
}
