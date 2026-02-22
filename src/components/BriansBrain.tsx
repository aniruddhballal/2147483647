import { useEffect, useRef } from "react";

// States: 0 = off, 1 = firing, 2 = dying
const BriansBrain = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const cellSize = 5;
    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);

    let grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () =>
        Math.random() < 0.2 ? 1 : Math.random() < 0.1 ? 2 : 0
      )
    );

    const countFiring = (g: number[][], r: number, c: number) => {
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = (r + dr + rows) % rows;
          const nc = (c + dc + cols) % cols;
          if (g[nr][nc] === 1) count++;
        }
      }
      return count;
    };

    let animId: number;

    const step = () => {
      const next = grid.map((row) => [...row]);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const state = grid[r][c];
          if (state === 1) {
            next[r][c] = 2; // firing → dying
          } else if (state === 2) {
            next[r][c] = 0; // dying → off
          } else {
            // off → firing if exactly 2 neighbors firing
            next[r][c] = countFiring(grid, r, c) === 2 ? 1 : 0;
          }
        }
      }

      ctx.fillStyle = "#080810";
      ctx.fillRect(0, 0, width, height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const state = next[r][c];
          if (state === 1) {
            ctx.fillStyle = "#e8f4ff"; // bright white-blue: firing
          } else if (state === 2) {
            ctx.fillStyle = "#4466cc"; // dim blue: dying
          } else {
            continue;
          }
          ctx.fillRect(c * cellSize, r * cellSize, cellSize - 1, cellSize - 1);
        }
      }

      grid = next;
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

export default BriansBrain;