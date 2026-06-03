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
//
// Swatches read the CSS variables directly (var(--color-<tone>-<step>)), which
// `@theme static` keeps in :root — so this renders the actual token values, not
// a hand-maintained copy. Layout/sizing uses inline styles rather than Tailwind
// utilities so the catalog renders correctly even from a cold/stale dev server
// (Tailwind only scans for class names at startup); the only dependency is that
// theme.css is loaded, which the Storybook preview imports via tokens.css.
function ColorTones() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        fontFamily: "Figtree, sans-serif",
      }}
    >
      {TONES.map((tone) => (
        <section key={tone}>
          <h3
            style={{
              margin: "0 0 0.5rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#475569",
            }}
          >
            {tone}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {STEPS.map((step) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <div
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #e2e8f0",
                    backgroundColor: `var(--color-${tone}-${step})`,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
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
