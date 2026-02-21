import { useState, useCallback } from "react";
import Rule30 from "../components/Rule30";
import Rule110 from "../components/Rule110";
import Rule90 from "../components/Rule90";
import GameOfLife from "../components/GameOfLife";
import BriansBrain from "../components/BriansBrain";
import Wireworld from "../components/Wireworld";
import LangtonsAnt from "../components/LangtonsAnt";
import GrayScott from "../components/GrayScott";

const automata = [
  {
    id: "rule30",
    name: "Rule 30",
    tag: "1D",
    description: "Chaotic — used by Wolfram as a random number generator",
    component: Rule30,
  },
  {
    id: "rule90",
    name: "Rule 90",
    tag: "1D",
    description: "Generates the Sierpiński triangle fractal",
    component: Rule90,
  },
  {
    id: "rule110",
    name: "Rule 110",
    tag: "1D",
    description: "Turing complete — complex repeating structures emerge",
    component: Rule110,
  },
  {
    id: "life",
    name: "Game of Life",
    tag: "2D",
    description: "Conway's classic — gliders, oscillators, emergent complexity",
    component: GameOfLife,
  },
  {
    id: "brian",
    name: "Brian's Brain",
    tag: "2D",
    description: "Three-state automaton — produces endless gliders",
    component: BriansBrain,
  },
  {
    id: "wireworld",
    name: "Wireworld",
    tag: "2D",
    description: "Simulates electron flow through circuit wires",
    component: Wireworld,
  },
  {
    id: "langton",
    name: "Langton's Ant",
    tag: "2D",
    description: "A single ant spontaneously builds a highway after ~10,000 steps",
    component: LangtonsAnt,
  },
  {
    id: "grayscott",
    name: "Gray–Scott",
    tag: "RD",
    description: "Reaction-diffusion — coral, spots, and stripe patterns",
    component: GrayScott,
  },
];

const tagColors: Record<string, string> = {
  "1D": "#f0a050",
  "2D": "#50c0f0",
  "RD": "#c050f0",
};

export default function App() {
  const [index, setIndex] = useState(0);

  const prev = useCallback(() => setIndex((i) => (i - 1 + automata.length) % automata.length), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % automata.length), []);

  const active = automata[index];
  const ActiveComponent = active.component;
  const tagColor = tagColors[active.tag] ?? "#fff";

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "'Courier New', monospace" }}>
      {/* Fullscreen canvas */}
      <div key={active.id} style={{ position: "absolute", inset: 0 }}>
        <ActiveComponent />
      </div>

      {/* Bottom bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "12px 20px",
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)",
        paddingTop: "32px",
      }}>
        {/* Prev button */}
        <button onClick={prev} style={btnStyle}>
          ← prev
        </button>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
            <span style={{
              color: tagColor,
              fontSize: "9px",
              letterSpacing: "0.18em",
              border: `1px solid ${tagColor}`,
              padding: "1px 6px",
              borderRadius: "2px",
              flexShrink: 0,
            }}>
              {active.tag}
            </span>
            <span style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: "bold",
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {active.name}
            </span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", flexShrink: 0 }}>
              {index + 1} / {automata.length}
            </span>
          </div>
          <p style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "11px",
            margin: 0,
            letterSpacing: "0.03em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {active.description}
          </p>
        </div>

        {/* Next button */}
        <button onClick={next} style={btnStyle}>
          next →
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "#fff",
  padding: "7px 16px",
  fontSize: "11px",
  letterSpacing: "0.12em",
  cursor: "pointer",
  borderRadius: "3px",
  backdropFilter: "blur(8px)",
  flexShrink: 0,
  transition: "background 0.15s",
};