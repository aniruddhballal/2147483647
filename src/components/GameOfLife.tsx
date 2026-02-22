import { useEffect, useRef } from "react";

const GameOfLife = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const cellSize = 6;
    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);

    // Initialize with random cells
    let grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => (Math.random() < 0.3 ? 1 : 0))
    );

    // Track age of each cell for color
    let age = Array.from({ length: rows }, () => new Array(cols).fill(0));

    const countNeighbors = (g: number[][], r: number, c: number) => {
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = (r + dr + rows) % rows;
          const nc = (c + dc + cols) % cols;
          count += g[nr][nc];
        }
      }
      return count;
    };

    let animId: number;

    const step = () => {
      const next = grid.map((row) => [...row]);
      const nextAge = age.map((row) => [...row]);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const n = countNeighbors(grid, r, c);
          if (grid[r][c] === 1) {
            next[r][c] = n === 2 || n === 3 ? 1 : 0;
            nextAge[r][c] = next[r][c] ? age[r][c] + 1 : 0;
          } else {
            next[r][c] = n === 3 ? 1 : 0;
            nextAge[r][c] = next[r][c] ? 1 : 0;
          }
        }
      }

      ctx.fillStyle = "#050a08";
      ctx.fillRect(0, 0, width, height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (next[r][c]) {
            const a = nextAge[r][c];
            // Young cells: bright green; older cells: deep teal
            const hue = 140 - Math.min(a, 80);
            const lightness = 70 - Math.min(a * 0.5, 30);
            ctx.fillStyle = `hsl(${hue}, 80%, ${lightness}%)`;
            ctx.fillRect(c * cellSize, r * cellSize, cellSize - 1, cellSize - 1);
          }
        }
      }

      grid = next;
      age = nextAge;
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

export default GameOfLife;