import { Avatar, EntityCard, TaskProgress } from "@prysm/design-system";
import type { Patient } from "../../data/patients";
import { signalsFor } from "../../data/residentSignals";
import { formatRoom } from "../lib/format";
import { ageSex, progressTone } from "../lib/residentDisplay";
import { ResidentChips, TransferIcon } from "./residentDisplay";

type ResidentCardProps = {
  patient: Patient;
  /** Makes the whole card an accessible button with a trailing chevron. */
  onPress?: () => void;
};

// The featured, attention-getting representation of a resident — used in the
// pinned "Needs attention" triage cluster. Same encoding as <ResidentRow/>,
// rendered at card density. Maps onto <EntityCard/>.
export default function ResidentCard({ patient, onPress }: ResidentCardProps) {
  const { tasksDone, tasksTotal } = signalsFor(patient.id);

  return (
    <EntityCard
      avatar={<Avatar name={patient.name} size="md" />}
      title={
        <span className="flex items-center gap-2">
          <span className="font-bold text-neutral-500 tabular-nums">{formatRoom(patient.room)}</span>
          <span>{patient.name}</span>
          <TransferIcon patient={patient} />
        </span>
      }
      subtitle={
        <>
          {patient.diagnosis} · {ageSex(patient)}
        </>
      }
      badges={<ResidentChips patient={patient} size="md" />}
      trailing={
        tasksTotal > 0 ? (
          <TaskProgress
            value={tasksDone}
            total={tasksTotal}
            size={52}
            tone={progressTone(patient)}
            label={`Care tasks: ${tasksDone} of ${tasksTotal} done`}
          />
        ) : undefined
      }
      onPress={onPress}
    />
  );
}
