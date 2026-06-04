import { useMemo } from "react";
import { AppBar, Button } from "@prysm/design-system";
import { RotateCcw } from "lucide-react";
import { useAnswers } from "./persistence";
import { buildBlocks } from "./prompt";
import QuestionsPane from "./components/QuestionsPane";
import OutputPane from "./components/OutputPane";

export default function App() {
  const { answers, update, setField, reset } = useAnswers();
  const blocks = useMemo(() => buildBlocks(answers), [answers]);

  const onReset = () => {
    if (window.confirm("Reset all answers? This clears everything saved in this browser.")) {
      reset();
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-50 font-['Figtree'] text-neutral-900">
      <AppBar
        tone="light"
        start={
          <div className="flex flex-col leading-tight">
            <span className="text-base font-extrabold">Interview Prompt Builder</span>
            <span className="text-xs text-neutral-500">
              Assemble paste-ready Claude Code prompts as you go
            </span>
          </div>
        }
        end={
          <Button variant="ghost" tone="danger" size="sm" iconLeft={RotateCcw} onClick={onReset}>
            Reset
          </Button>
        }
      />
      <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden p-6 lg:grid-cols-2">
        <div className="min-h-0 overflow-y-auto pr-1">
          <QuestionsPane answers={answers} update={update} setField={setField} />
        </div>
        <div className="min-h-0 overflow-y-auto pr-1">
          <OutputPane blocks={blocks} />
        </div>
      </div>
    </div>
  );
}
