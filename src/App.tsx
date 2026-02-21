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
    description: "A single ant spawns a highway after ~10,000 steps",
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
  const [activeId, setActiveId] = useState("rule30");
  const [panelOpen, setPanelOpen] = useState(true);

  const active = automata.find((a) => a.id === activeId)!;
  const ActiveComponent = active.component;

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    setPanelOpen(false);
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "'Courier New', monospace" }}>
      {/* Automaton canvas fills the screen */}
      <div key={activeId} style={{ position: "absolute", inset: 0 }}>
        <ActiveComponent />
      </div>

      {/* Top bar */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
        pointerEvents: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            color: "#fff",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.5,
          }}>
            Cellular Automata
          </span>
          <span style={{
            color: tagColors[active.tag] ?? "#fff",
            fontSize: "10px",
            letterSpacing: "0.15em",
            border: `1px solid ${tagColors[active.tag] ?? "#fff"}`,
            padding: "2px 6px",
            borderRadius: "2px",
            opacity: 0.9,
          }}>
            {active.tag}
          </span>
          <span style={{
            color: "#fff",
            fontSize: "15px",
            fontWeight: "bold",
            letterSpacing: "0.05em",
          }}>
            {active.name}
          </span>
        </div>

        <button
          onClick={() => setPanelOpen((p) => !p)}
          style={{
            pointerEvents: "all",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            padding: "6px 14px",
            fontSize: "11px",
            letterSpacing: "0.15em",
            cursor: "pointer",
            borderRadius: "3px",
            backdropFilter: "blur(8px)",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        >
          {panelOpen ? "CLOSE" : "SWITCH"}
        </button>
      </div>

      {/* Side panel */}
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: "320px",
        background: "rgba(8, 8, 12, 0.92)",
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        transform: panelOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        paddingTop: "64px",
      }}>
        <div style={{ padding: "0 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "0.2em", margin: 0 }}>
            SELECT AUTOMATON
          </p>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {automata.map((a) => {
            const isActive = a.id === activeId;
            return (
              <button
                key={a.id}
                onClick={() => handleSelect(a.id)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "16px 20px",
                  background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  borderLeft: isActive ? `2px solid ${tagColors[a.tag] ?? "#fff"}` : "2px solid transparent",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{
                    color: tagColors[a.tag] ?? "#fff",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    border: `1px solid ${tagColors[a.tag] ?? "#fff"}`,
                    padding: "1px 5px",
                    borderRadius: "2px",
                    opacity: 0.8,
                  }}>
                    {a.tag}
                  </span>
                  <span style={{
                    color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                    fontSize: "13px",
                    fontWeight: isActive ? "bold" : "normal",
                    letterSpacing: "0.05em",
                  }}>
                    {a.name}
                  </span>
                </div>
                <p style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "11px",
                  margin: 0,
                  lineHeight: 1.5,
                  letterSpacing: "0.02em",
                }}>
                  {a.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", gap: "16px" }}>
            {Object.entries(tagColors).map(([tag, color]) => (
              <div key={tag} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "8px", height: "8px", background: color, borderRadius: "1px" }} />
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "0.1em" }}>{tag}</span>
              </div>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "9px", marginTop: "10px", marginBottom: 0, letterSpacing: "0.1em" }}>
            1D = one-dimensional · 2D = grid · RD = reaction-diffusion
          </p>
        </div>
      </div>
    </div>
  );
}