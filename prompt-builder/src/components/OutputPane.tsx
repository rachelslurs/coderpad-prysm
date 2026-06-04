import { useState } from "react";
import { Button } from "@prysm/design-system";
import { Check, ClipboardList } from "lucide-react";
import type { Block } from "../prompt";
import PromptBlock from "./PromptBlock";

// Right pane: the live, separately-copyable prompt blocks, plus a "copy all"
// convenience. Blocks stay visually distinct (one Card each).
export default function OutputPane({ blocks }: { blocks: Block[] }) {
  const [copiedAll, setCopiedAll] = useState(false);

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(blocks.map((b) => b.text).join("\n\n"));
      setCopiedAll(true);
      window.setTimeout(() => setCopiedAll(false), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Prompt blocks · {blocks.length}
        </h2>
        <Button
          variant="solid"
          tone="accent"
          size="sm"
          iconLeft={copiedAll ? Check : ClipboardList}
          onClick={copyAll}
        >
          {copiedAll ? "Copied all" : "Copy all"}
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {blocks.map((b, i) => (
          <PromptBlock key={b.id} step={i + 1} block={b} />
        ))}
      </div>
    </div>
  );
}
