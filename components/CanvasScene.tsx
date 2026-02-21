import { useEffect, useRef } from "react";

const CanvasScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const equation = (x: number): number => x * x;

    const valueToColor = (t: number): [number, number, number] => {
      const r = Math.round(30 + 200 * t);
      const g = Math.round(80 + 50 * (1 - Math.abs(t - 0.5) * 2));
      const b = Math.round(200 - 170 * t);
      return [r, g, b];
    };

    const ballRadius = 60;
    const ballX = width / 2;
    const ballY = height / 2;

    const imageData = ctx.createImageData(ballRadius * 2, ballRadius * 2);

    for (let py = 0; py < ballRadius * 2; py++) {
      for (let px = 0; px < ballRadius * 2; px++) {
        const nx = (px - ballRadius) / ballRadius;
        const ny = (py - ballRadius) / ballRadius;
        const dist = Math.sqrt(nx * nx + ny * ny);
        if (dist > 1) continue;

        const rawValue = equation(nx);
        const t = Math.max(0, Math.min(1, rawValue)); // x^2 is already in [0,1] for x in [-1,1]
        const lighting = 0.4 + 0.6 * Math.max(0, 1 - dist);
        const [r, g, b] = valueToColor(t);

        const idx = (py * ballRadius * 2 + px) * 4;
        imageData.data[idx + 0] = Math.round(r * lighting);
        imageData.data[idx + 1] = Math.round(g * lighting);
        imageData.data[idx + 2] = Math.round(b * lighting);
        imageData.data[idx + 3] = 255;
      }
    }

    const offscreen = document.createElement("canvas");
    offscreen.width = ballRadius * 2;
    offscreen.height = ballRadius * 2;
    offscreen.getContext("2d")!.putImageData(imageData, 0, 0);
    ctx.drawImage(offscreen, ballX - ballRadius, ballY - ballRadius);
  }, []);

  return <canvas ref={canvasRef} />;
};

export default CanvasScene;