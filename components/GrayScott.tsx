import { useEffect, useRef } from "react";

const GrayScott = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Use a smaller grid for performance, upscale when drawing
    const scale = 2;
    const cols = Math.floor(width / scale);
    const rows = Math.floor(height / scale);
    const size = cols * rows;

    // Feed/kill parameters — coral pattern
    const feed = 0.055;
    const kill = 0.062;
    const dA = 1.0;
    const dB = 0.5;
    const dt = 1.0;

    let A = new Float32Array(size).fill(1);
    let B = new Float32Array(size).fill(0);

    // Seed some B in the center
    const seedRadius = 10;
    for (let r = -seedRadius; r <= seedRadius; r++) {
      for (let c = -seedRadius; c <= seedRadius; c++) {
        const idx = (Math.floor(rows / 2) + r) * cols + Math.floor(cols / 2) + c;
        if (idx >= 0 && idx < size) B[idx] = 1;
      }
    }

    const laplacianA = (i: number, j: number) => {
      const idx = i * cols + j;
      const up = ((i - 1 + rows) % rows) * cols + j;
      const down = ((i + 1) % rows) * cols + j;
      const left = i * cols + (j - 1 + cols) % cols;
      const right = i * cols + (j + 1) % cols;
      return A[up] + A[down] + A[left] + A[right] - 4 * A[idx];
    };

    const laplacianB = (i: number, j: number) => {
      const idx = i * cols + j;
      const up = ((i - 1 + rows) % rows) * cols + j;
      const down = ((i + 1) % rows) * cols + j;
      const left = i * cols + (j - 1 + cols) % cols;
      const right = i * cols + (j + 1) % cols;
      return B[up] + B[down] + B[left] + B[right] - 4 * B[idx];
    };

    const imageData = ctx.createImageData(cols, rows);
    let animId: number;

    const stepsPerFrame = 10;

    const step = () => {
      for (let s = 0; s < stepsPerFrame; s++) {
        const nextA = new Float32Array(size);
        const nextB = new Float32Array(size);

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            const idx = i * cols + j;
            const a = A[idx];
            const b = B[idx];
            const reaction = a * b * b;

            nextA[idx] = a + (dA * laplacianA(i, j) - reaction + feed * (1 - a)) * dt;
            nextB[idx] = b + (dB * laplacianB(i, j) + reaction - (kill + feed) * b) * dt;

            nextA[idx] = Math.max(0, Math.min(1, nextA[idx]));
            nextB[idx] = Math.max(0, Math.min(1, nextB[idx]));
          }
        }

        A = nextA;
        B = nextB;
      }

      // Render
      for (let i = 0; i < size; i++) {
        const t = Math.max(0, Math.min(1, A[i] - B[i]));
        // Deep teal to warm coral palette
        const r = Math.round(20 + 200 * (1 - t));
        const g = Math.round(40 + 140 * t * (1 - t) * 4);
        const bl = Math.round(60 + 140 * t);
        imageData.data[i * 4 + 0] = r;
        imageData.data[i * 4 + 1] = g;
        imageData.data[i * 4 + 2] = bl;
        imageData.data[i * 4 + 3] = 255;
      }

      // Draw to offscreen, scale up
      const offscreen = document.createElement("canvas");
      offscreen.width = cols;
      offscreen.height = rows;
      offscreen.getContext("2d")!.putImageData(imageData, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offscreen, 0, 0, width, height);

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

export default GrayScott;