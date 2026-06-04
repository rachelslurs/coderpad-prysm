import { useState } from "react";
import { Button } from "@prysm/design-system";
import { Check, Copy } from "lucide-react";

// Copies the given text and briefly flips to a "Copied" confirmation. localhost
// is a secure context, so navigator.clipboard is available.
export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <Button
      variant="outline"
      tone={copied ? "success" : "accent"}
      size="sm"
      iconLeft={copied ? Check : Copy}
      onClick={onCopy}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
