import { useState, useRef, useEffect, useCallback } from "react";

// All 8 possible 3-cell neighborhoods for a 1D CA
const PATTERNS = [
  [1,1,1], [1,1,0], [1,0,1], [1,0,0],
  [0,1,1], [0,1,0], [0,0,1], [0,0,0],
];

const patternIndex = (a, b, c) => {
  // maps [a,b,c] to index 0..7 (111=0, 110=1, ... 000=7)
  return 7 - (a * 4 + b * 2 + c);
};

const ruleToOutputs = (ruleNum) => {
  // returns array of 8 outputs indexed 0..7 (bit 7 = pattern 111, bit 0 = pattern 000)
  return PATTERNS.map((_, i) => (ruleNum >> (7 - i)) & 1);
};

const outputsToRule = (outputs) => {
  return outputs.reduce((acc, bit, i) => acc + (bit << (7 - i)), 0);
};

const CELL_SIZE = 6;
const COLS = 120;

export default function RuleGenerator() {
  const [outputs, setOutputs] = useState(() => ruleToOutputs(30));
  const [ruleInput, setRuleInput] = useState("30");
  const [mode, setMode] = useState("manual"); // "manual" | "auto"
  const [speed, setSpeed] = useState(120); // ms per step
  const [rows, setRows] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const canvasRef = useRef(null);
  const autoRef = useRef(null);
  const rowsRef = useRef([]);
  const scrollRef = useRef(null);

  const ruleNum = outputsToRule(outputs);

  // Init first row
  const initRows = useCallback(() => {
    const first = new Uint8Array(COLS);
    first[Math.floor(COLS / 2)] = 1;
    rowsRef.current = [first];
    setRows([first]);
  }, []);

  useEffect(() => { initRows(); }, [initRows]);

  // Draw on canvas whenever rows change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const r = rowsRef.current;
    const visibleRows = r.length;
    canvas.width = COLS * CELL_SIZE;
    canvas.height = Math.max(visibleRows * CELL_SIZE, 20);

    ctx.fillStyle = "#0b0b0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    r.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        if (cell) {
          const hue = 25 + (ci / COLS) * 40;
          ctx.fillStyle = `hsl(${hue}, 90%, 62%)`;
          ctx.fillRect(ci * CELL_SIZE, ri * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      });
    });

    // Autoscroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [rows]);

  const stepOnce = useCallback(() => {
    const current = rowsRef.current;
    const last = current[current.length - 1];
    const next = new Uint8Array(COLS);
    for (let c = 0; c < COLS; c++) {
      const a = last[(c - 1 + COLS) % COLS];
      const b = last[c];
      const cv = last[(c + 1) % COLS];
      const idx = patternIndex(a, b, cv);
      next[c] = outputs[idx];
    }
    rowsRef.current = [...current, next];
    setRows([...rowsRef.current]);
  }, [outputs]);

  // Auto mode
  useEffect(() => {
    if (mode === "auto" && isRunning) {
      autoRef.current = setInterval(stepOnce, speed);
    } else {
      clearInterval(autoRef.current);
    }
    return () => clearInterval(autoRef.current);
  }, [mode, isRunning, speed, stepOnce]);

  const toggleOutput = (i) => {
    const next = [...outputs];
    next[i] = next[i] ? 0 : 1;
    setOutputs(next);
    setRuleInput(String(outputsToRule(next)));
  };

  const applyRuleNum = () => {
    const n = parseInt(ruleInput, 10);
    if (isNaN(n) || n < 0 || n > 255) return;
    setOutputs(ruleToOutputs(n));
  };

  const reset = () => {
    setIsRunning(false);
    clearInterval(autoRef.current);
    initRows();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b0b0f",
      color: "#fff",
      fontFamily: "'Sora', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 16px",
      gap: "28px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, letterSpacing: "0.08em", color: "#fff" }}>
          Rule Generator
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
          1D Cellular Automaton Builder
        </p>
      </div>

      {/* Rule number input */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>RULE</span>
        <input
          type="number"
          min={0} max={255}
          value={ruleInput}
          onChange={(e) => setRuleInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyRuleNum()}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "6px",
            color: "#fff",
            fontFamily: "'Sora', sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            width: "80px",
            padding: "6px 10px",
            textAlign: "center",
            outline: "none",
          }}
        />
        <button onClick={applyRuleNum} style={pillBtn("#f0a050")}>Apply</button>
        <button onClick={reset} style={pillBtn("rgba(255,255,255,0.15)")}>Reset</button>
      </div>

      {/* Rule table — 8 pattern toggles */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        {PATTERNS.map(([a, b, c], i) => (
          <div key={i} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "10px",
            padding: "10px 10px 8px",
            minWidth: "52px",
          }}>
            {/* Neighborhood preview */}
            <div style={{ display: "flex", gap: "3px" }}>
              {[a, b, c].map((v, j) => (
                <div key={j} style={{
                  width: "13px", height: "13px", borderRadius: "3px",
                  background: v ? "#f0a050" : "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }} />
              ))}
            </div>
            {/* Arrow */}
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>↓</span>
            {/* Output toggle */}
            <div
              onClick={() => toggleOutput(i)}
              style={{
                width: "22px", height: "22px", borderRadius: "5px",
                background: outputs[i] ? "#f0a050" : "rgba(255,255,255,0.06)",
                border: `1px solid ${outputs[i] ? "#f0a050" : "rgba(255,255,255,0.15)"}`,
                cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: outputs[i] ? "0 0 8px rgba(240,160,80,0.5)" : "none",
              }}
            />
            {/* Pattern label */}
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
              {a}{b}{c}
            </span>
          </div>
        ))}
      </div>

      {/* Mode + controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        {/* Mode toggle */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.1)",
          overflow: "hidden",
        }}>
          {["manual", "auto"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setIsRunning(false); }}
              style={{
                background: mode === m ? "rgba(240,160,80,0.2)" : "transparent",
                border: "none",
                borderRight: m === "manual" ? "1px solid rgba(255,255,255,0.1)" : "none",
                color: mode === m ? "#f0a050" : "rgba(255,255,255,0.4)",
                fontFamily: "'Sora', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.1em",
                padding: "8px 18px",
                cursor: "pointer",
                transition: "all 0.15s",
                textTransform: "uppercase",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {mode === "manual" && (
          <button onClick={stepOnce} style={pillBtn("#f0a050")}>
            Next →
          </button>
        )}

        {mode === "auto" && (
          <>
            <button
              onClick={() => setIsRunning((r) => !r)}
              style={pillBtn(isRunning ? "rgba(255,80,80,0.3)" : "#f0a050")}
            >
              {isRunning ? "⏸ Pause" : "▶ Run"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>SPEED</span>
              <input
                type="range" min={20} max={500} step={10}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                style={{ accentColor: "#f0a050", width: "90px" }}
              />
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", minWidth: "40px" }}>
                {speed}ms
              </span>
            </div>
          </>
        )}
      </div>

      {/* Generation counter */}
      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
        GENERATION {rows.length - 1} · RULE {ruleNum}
      </div>

      {/* Canvas */}
      <div ref={scrollRef} style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px",
        overflow: "auto",
        maxHeight: "420px",
        maxWidth: "100%",
        background: "#0b0b0f",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.1) transparent",
      }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>
    </div>
  );
}

function pillBtn(bg) {
  return {
    background: typeof bg === "string" && bg.startsWith("#") ? bg + "22" : bg,
    border: `1px solid ${typeof bg === "string" && bg.startsWith("#") ? bg + "66" : "rgba(255,255,255,0.15)"}`,
    color: typeof bg === "string" && bg.startsWith("#") ? bg : "#fff",
    fontFamily: "'Sora', sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    letterSpacing: "0.06em",
    transition: "all 0.15s",
  };
}