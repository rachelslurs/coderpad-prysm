import type { Meta, StoryObj } from "@storybook/react-vite";

const TONES = [
  "neutral",
  "accent",
  "info",
  "success",
  "warning",
  "danger",
] as const;

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

// Living catalog of the semantic color tones defined in styles/theme.css.
// Swatches read the CSS variables directly (var(--color-<tone>-<step>)), which
// `@theme static` keeps in :root — so this renders the actual token values, not
// a hand-maintained copy.
function ColorTones() {
  return (
    <div className="space-y-6 font-['Figtree']">
      {TONES.map((tone) => (
        <section key={tone}>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-slate-600">
            {tone}
          </h3>
          <div className="flex flex-wrap gap-2">
            {STEPS.map((step) => (
              <div key={step} className="flex flex-col items-center gap-1">
                <div
                  className="h-12 w-12 rounded border border-slate-200"
                  style={{ backgroundColor: `var(--color-${tone}-${step})` }}
                />
                <span className="text-xs tabular-nums text-slate-500">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: "Tokens/Color Tones",
  component: ColorTones,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ColorTones>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllTones: Story = {};
