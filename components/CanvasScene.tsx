import { useEffect, useRef } from "react";

const CanvasScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();

      const amplitude = 100;       // wave height
      const frequency = 0.01;      // wave density
      const speed = 0.05;          // oscillation speed

      for (let x = 0; x < width; x++) {
        const y =
          height / 2 +
          amplitude * Math.sin(x * frequency + time);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();

      time += speed;

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};

export default CanvasScene;