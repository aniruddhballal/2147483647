import { useEffect, useRef } from "react";

const Rule30 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const cellSize = 4;
    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);

    // Rule 30 lookup: pattern index (3 bits) → output
    const rule = 30;
    const ruleLookup = (a: number, b: number, c: number) =>
      (rule >> (a * 4 + b * 2 + c)) & 1;

    let current = new Uint8Array(cols);
    current[Math.floor(cols / 2)] = 1; // single seed in center

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, width, height);

    for (let row = 0; row < rows; row++) {
      const next = new Uint8Array(cols);
      for (let col = 0; col < cols; col++) {
        const a = current[(col - 1 + cols) % cols];
        const b = current[col];
        const c = current[(col + 1) % cols];
        next[col] = ruleLookup(a, b, c);

        if (next[col]) {
          // Color based on position for visual interest
          const hue = (col / cols) * 60 + 10; // orange-red range
          ctx.fillStyle = `hsl(${hue}, 90%, 60%)`;
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
      current = next;
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100vw", height: "100vh" }}
    />
  );
};

export default Rule30;