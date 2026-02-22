import { useEffect, useRef } from "react";

// States: 0=empty, 1=conductor, 2=electron head, 3=electron tail
const Wireworld = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const cellSize = 8;
    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);

    const EMPTY = 0, CONDUCTOR = 1, HEAD = 2, TAIL = 3;

    // Build a circuit: oscillators feeding into wires
    const grid = Array.from({ length: rows }, () => new Array(cols).fill(EMPTY));

    const drawWire = (r: number, c: number, length: number, dir: "h" | "v") => {
      for (let i = 0; i < length; i++) {
        const rr = dir === "v" ? r + i : r;
        const cc = dir === "h" ? c + i : c;
        if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) {
          grid[rr][cc] = CONDUCTOR;
        }
      }
    };

    // Draw several oscillator-fed wire loops across the canvas
    const numCircuits = 4;
    for (let i = 0; i < numCircuits; i++) {
      const baseRow = Math.floor(rows * (i + 0.5) / numCircuits);
      const baseCol = 5;
      const wireLen = cols - 15;

      // Top wire
      drawWire(baseRow - 2, baseCol, wireLen, "h");
      // Bottom wire
      drawWire(baseRow + 2, baseCol, wireLen, "h");
      // Left connector
      drawWire(baseRow - 2, baseCol, 5, "v");
      // Right connector
      drawWire(baseRow - 2, baseCol + wireLen - 1, 5, "v");

      // Seed electrons
      if (baseRow - 2 >= 0 && baseRow - 2 < rows && baseCol + 2 < cols) {
        grid[baseRow - 2][baseCol + 2] = HEAD;
        grid[baseRow - 2][baseCol + 1] = TAIL;
      }
      if (baseRow + 2 >= 0 && baseRow + 2 < rows && baseCol + wireLen - 3 < cols) {
        grid[baseRow + 2][baseCol + wireLen - 3] = HEAD;
        grid[baseRow + 2][baseCol + wireLen - 2] = TAIL;
      }
    }

    const countHeads = (g: number[][], r: number, c: number) => {
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc] === HEAD) count++;
        }
      }
      return count;
    };

    let animId: number;

    const step = () => {
      const next = grid.map((row) => [...row]);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const s = grid[r][c];
          if (s === HEAD) next[r][c] = TAIL;
          else if (s === TAIL) next[r][c] = CONDUCTOR;
          else if (s === CONDUCTOR) {
            const h = countHeads(grid, r, c);
            next[r][c] = (h === 1 || h === 2) ? HEAD : CONDUCTOR;
          }
        }
      }

      ctx.fillStyle = "#060606";
      ctx.fillRect(0, 0, width, height);

      const colors = ["#060606", "#332200", "#ffdd44", "#ff6600"];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const s = next[r][c];
          if (s === EMPTY) continue;
          ctx.fillStyle = colors[s];
          ctx.fillRect(c * cellSize + 1, r * cellSize + 1, cellSize - 2, cellSize - 2);

          // Glow for electron head
          if (s === HEAD) {
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#ffdd44";
            ctx.fillRect(c * cellSize + 1, r * cellSize + 1, cellSize - 2, cellSize - 2);
            ctx.shadowBlur = 0;
          }
        }
      }

      Object.assign(grid, next.map(r => [...r]));
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) grid[r][c] = next[r][c];

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100vw", height: "100vh" }}
    />
  );
};

export default Wireworld;