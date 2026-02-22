import { useState, useCallback } from "react";
import Rule30 from "./components/Rule30";
import Rule110 from "./components/Rule110";
import Rule90 from "./components/Rule90";
import GameOfLife from "./components/GameOfLife";
import BriansBrain from "./components/BriansBrain";
import Wireworld from "./components/Wireworld";
import LangtonsAnt from "./components/LangtonsAnt";
import GrayScott from "./components/GrayScott";
import RuleGenerator from "./components/RuleGenerator";

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
  const [showGenerator, setShowGenerator] = useState(false);

  const prev = useCallback(() => setIndex((i) => (i - 1 + automata.length) % automata.length), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % automata.length), []);

  const active = automata[index];
  const ActiveComponent = active.component;
  const tagColor = tagColors[active.tag] ?? "#fff";

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "'Sora', sans-serif" }}>

      {/* Fullscreen automaton canvas */}
      <div key={active.id} style={{ position: "absolute", inset: 0 }}>
        <ActiveComponent />
      </div>

      {/* Floating capsule — nav */}
      <div style={{
        position: "absolute",
        bottom: "28px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        borderRadius: "999px",
        background: "rgba(10, 10, 14, 0.82)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}>
        <button onClick={prev} style={arrowBtnStyle}>‹</button>
        <div style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />

        <div style={{ padding: "10px 20px", textAlign: "center", width: "440px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{
              color: tagColor, fontSize: "9px", letterSpacing: "0.18em",
              border: `1px solid ${tagColor}`, padding: "1px 6px", borderRadius: "999px",
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

        <div style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />
        <button onClick={next} style={arrowBtnStyle}>›</button>
      </div>

      {/* Rule Generator button — top right */}
      <button
        onClick={() => setShowGenerator(true)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "rgba(10, 10, 14, 0.82)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(240,160,80,0.35)",
          borderRadius: "999px",
          color: "#f0a050",
          fontFamily: "'Sora', sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          padding: "8px 18px",
          cursor: "pointer",
          transition: "all 0.2s",
          boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(240,160,80,0.15)";
          e.currentTarget.style.borderColor = "rgba(240,160,80,0.7)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(10,10,14,0.82)";
          e.currentTarget.style.borderColor = "rgba(240,160,80,0.35)";
        }}
      >
        ⚙ RULE GENERATOR
      </button>

      {/* Rule Generator overlay */}
      {showGenerator && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowGenerator(false)}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 10,
            }}
          />

          {/* Panel */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(860px, 92vw)",
            height: "min(680px, 88vh)",
            background: "#0b0b0f",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
            zIndex: 11,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Panel top bar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              flexShrink: 0,
            }}>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", letterSpacing: "0.2em" }}>
                RULE GENERATOR
              </span>
              <button
                onClick={() => setShowGenerator(false)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "6px",
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "12px",
                  padding: "4px 12px",
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                }}
              >
                ✕ close
              </button>
            </div>

            {/* RuleGenerator fills the rest */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <RuleGenerator />
            </div>
          </div>
        </>
      )}
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
  transition: "color 0.15s",
  flexShrink: 0,
};