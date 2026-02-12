import { useEffect, useRef } from "react";

export default function BackgroundSystem({ showFirework, showFinal }) {
  const matrixRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    const canvas = matrixRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = document.documentElement.scrollHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // ===== Matrix =====
    const letters = "LOVE0123456789❤";
    const fontSize = 16;
    let columns = Math.floor(w / fontSize);
    const drops = new Array(columns).fill(1);

    function drawMatrix() {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#ff4da6";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > h && Math.random() > 0.975)
          drops[i] = 0;

        drops[i]++;
      }
    }

    // ===== Rose petals =====
    const petals = [];
    class Petal {
      constructor() {
        this.x = Math.random() * w;
        this.y = -20;
        this.size = Math.random() * 8 + 6;
        this.speed = Math.random() * 1 + 0.5;
        this.swing = Math.random() * 2;
      }
      update() {
        this.y += this.speed;
        this.x += Math.sin(this.y * 0.01) * this.swing;
      }
      draw() {
        ctx.fillStyle = "rgba(255,80,150,.8)";
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ===== Firework =====
    const particles = [];
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 6 - 3;
        this.vy = Math.random() * 6 - 3;
        this.life = 100;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
      }
      draw() {
        ctx.fillStyle = `rgba(255,150,200,${this.life / 100})`;
        ctx.fillRect(this.x, this.y, 2, 2);
      }
    }

    function explode() {
      const x = Math.random() * w;
      const y = Math.random() * h * 0.6;
      for (let i = 0; i < 120; i++) {
        particles.push(new Particle(x, y));
      }
    }

    // ===== 主循环 =====
    function animate() {
      drawMatrix();

      if (showFinal) {
        if (petals.length < 80) petals.push(new Petal());
        petals.forEach((p, i) => {
          p.update();
          p.draw();
          if (p.y > h) petals.splice(i, 1);
        });
      }

      if (showFirework && Math.random() > 0.96) explode();

      particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.life <= 0) particles.splice(i, 1);
      });

      effectRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(effectRef.current);
  }, [showFirework, showFinal]);

  return (
    <canvas
      ref={matrixRef}
      style={{
        position: "fixed",   // ❗ 必须 fixed
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,          // 在所有内容后面
        pointerEvents: "none"
      }}
    />
  );
}
