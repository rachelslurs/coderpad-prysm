import { Card } from "@prysm/design-system";
import type { Block } from "../prompt";
import CopyButton from "./CopyButton";

// One generated prompt block: title (chrome) + its own copy button + the
// paste-ready prose. The copied text is the prose only — never the title.
export default function PromptBlock({ block }: { block: Block }) {
  return (
    <Card padding="md" className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          {block.title}
        </h3>
        <CopyButton text={block.text} />
      </div>
      <pre className="select-text whitespace-pre-wrap break-words rounded-lg bg-neutral-50 p-3 font-['Figtree'] text-sm leading-relaxed text-neutral-800">
        {block.text}
      </pre>
    </Card>
  );
}
