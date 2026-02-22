import { useEffect, useRef } from "react";

const Rule90 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const cellSize = 4;
    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);

    // Rule 90: output = left XOR right
    const ruleLookup = (a: number, _b: number, c: number) => a ^ c;

    let current = new Uint8Array(cols);
    current[Math.floor(cols / 2)] = 1;

    ctx.fillStyle = "#080610";
    ctx.fillRect(0, 0, width, height);

    for (let row = 0; row < rows; row++) {
      const next = new Uint8Array(cols);
      for (let col = 0; col < cols; col++) {
        const a = current[(col - 1 + cols) % cols];
        const b = current[col];
        const c = current[(col + 1) % cols];
        next[col] = ruleLookup(a, b, c);

        if (next[col]) {
          const hue = 270 + (col / cols) * 60; // purple range
          ctx.fillStyle = `hsl(${hue}, 80%, 65%)`;
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

export default Rule90;