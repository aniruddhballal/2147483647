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
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "'Sora', sans-serif" }}>
      {/* Fullscreen canvas */}
      <div key={active.id} style={{ position: "absolute", inset: 0 }}>
        <ActiveComponent />
      </div>

      {/* Floating capsule */}
      <div style={{
        position: "absolute",
        bottom: "28px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "0",
        borderRadius: "999px",
        background: "rgba(10, 10, 14, 0.82)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}>
        {/* Prev */}
        <button onClick={prev} style={arrowBtnStyle}>
          ‹
        </button>

        {/* Divider */}
        <div style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />

        {/* Info */}
        <div style={{ padding: "10px 20px", textAlign: "center", width: "440px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{
              color: tagColor,
              fontSize: "9px",
              letterSpacing: "0.18em",
              border: `1px solid ${tagColor}`,
              padding: "1px 6px",
              borderRadius: "999px",
            }}>
              {active.tag}
            </span>
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: "bold", letterSpacing: "0.06em" }}>
              {active.name}
            </span>
            <span style={{ color: "#fff", fontSize: "10px", opacity: 0.5 }}>
              {index + 1}/{automata.length}
            </span>
          </div>
          <p style={{ color: "#fff", fontSize: "11px", margin: "3px 0 0", letterSpacing: "0.02em" }}>
            {active.description}
          </p>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />

        {/* Next */}
        <button onClick={next} style={arrowBtnStyle}>
          ›
        </button>
      </div>
    </div>
  );
}

const arrowBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#fff",
  padding: "0 20px",
  fontSize: "22px",
  cursor: "pointer",
  height: "56px",
  display: "flex",
  alignItems: "center",
  transition: "color 0.15s, background 0.15s",
  flexShrink: 0,
};