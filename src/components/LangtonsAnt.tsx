import { useEffect, useRef } from "react";

const LangtonsAnt = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const cellSize = 4;
    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);

    const grid = new Uint8Array(cols * rows); // 0 = white, 1 = black

    // Multiple ants for a richer visual
    const numAnts = 3;
    const ants = Array.from({ length: numAnts }, (_, i) => ({
      x: Math.floor(cols / 2) + (i - 1) * 20,
      y: Math.floor(rows / 2),
      dir: i, // 0=up,1=right,2=down,3=left
    }));

    const antColors = ["#ff4444", "#44ff88", "#4488ff"];

    const dx = [0, 1, 0, -1];
    const dy = [-1, 0, 1, 0];

    let animId: number;
    let stepCount = 0;
    const stepsPerFrame = 50;

    const step = () => {
      for (let s = 0; s < stepsPerFrame; s++) {
        for (const ant of ants) {
          const idx = ant.y * cols + ant.x;
          const cell = grid[idx];

          if (cell === 0) {
            // white: turn right, flip to black
            ant.dir = (ant.dir + 1) % 4;
            grid[idx] = 1;
          } else {
            // black: turn left, flip to white
            ant.dir = (ant.dir + 3) % 4;
            grid[idx] = 0;
          }

          ant.x = (ant.x + dx[ant.dir] + cols) % cols;
          ant.y = (ant.y + dy[ant.dir] + rows) % rows;
        }
        stepCount++;
      }

      ctx.fillStyle = "#f0ede8";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < grid.length; i++) {
        if (grid[i] === 1) {
          const c = i % cols;
          const r = Math.floor(i / cols);
          ctx.fillStyle = "#1a1614";
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }

      // Draw ants
      for (let i = 0; i < ants.length; i++) {
        ctx.fillStyle = antColors[i];
        ctx.beginPath();
        ctx.arc(
          ants[i].x * cellSize + cellSize / 2,
          ants[i].y * cellSize + cellSize / 2,
          cellSize,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

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

export default LangtonsAnt;