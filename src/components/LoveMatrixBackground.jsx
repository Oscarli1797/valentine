import { useEffect, useRef } from "react";

export default function LoveMatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height, columns;
    let drops = [];

    const letters = "ILOVEULUCIA4EVER❤18122019";
    const fontSize = 16;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1);
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      // 不是纯黑，而是宇宙暗色（关键）
      ctx.fillStyle = "rgba(5,8,20,0.25)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];

        // 粉蓝混合色（统一主题）
        ctx.fillStyle = Math.random() > 0.9 ? "#ff6ec7" : "#7ad7ff";

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) drops[i] = 0;

        drops[i]++;
      }

      requestAnimationFrame(draw);
    }

    draw();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -5,
        pointerEvents: "none"
      }}
    />
  );
}
