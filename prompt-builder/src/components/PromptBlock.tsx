import { Card } from "@prysm/design-system";
import type { Block } from "../prompt";
import CopyButton from "./CopyButton";

// One generated prompt block: a step number + title (chrome) + its own copy
// button + the paste-ready prose. The step number reflects the block's position
// in the build sequence. The copied text is the prose only — never the title.
export default function PromptBlock({ step, block }: { step: number; block: Block }) {
  return (
    <Card padding="md" className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[11px] font-bold text-neutral-600">
            {step}
          </span>
          <h3 className="truncate text-xs font-bold uppercase tracking-wider text-neutral-500">
            {block.title}
          </h3>
        </div>
        <CopyButton text={block.text} />
      </div>
      <pre className="select-text whitespace-pre-wrap break-words rounded-lg bg-neutral-50 p-3 font-['Figtree'] text-sm leading-relaxed text-neutral-800">
        {block.text}
      </pre>
    </Card>
  );
}
