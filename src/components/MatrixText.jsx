import { useEffect, useRef } from "react";

export default function MatrixText({ text, size = 60 }) {

  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const DPR = window.devicePixelRatio || 1;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * DPR;
    canvas.height = height * DPR;
    ctx.scale(DPR, DPR);

    // ========= 用中文字体渲染目标文字 =========
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${size}px "PingFang SC","Microsoft YaHei"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);

    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = [];

    // ⭐ 这里才是清晰关键 —— 高分辨率采样
    const gap = 2;

    for (let y = 0; y < canvas.height; y += gap) {
      for (let x = 0; x < canvas.width; x += gap) {

        const i = (y * canvas.width + x) * 4;

        if (img.data[i + 3] > 150) {
          particles.push({
            tx: x / DPR,
            ty: y / DPR,
            x: Math.random() * width,
            y: Math.random() * height,
            speed: Math.random() * 0.10 + 0.05,
            glow: Math.random()
          });
        }
      }
    }

    function drawParticle(p) {

      // ⭐ 用像素块，而不是字符
      const size = 1.8;

      ctx.fillStyle = `rgba(255,70,150,${0.6 + p.glow * 0.4})`;
      ctx.fillRect(p.x, p.y, size, size);

      // 偶尔闪字符（增加Matrix味）
      if (Math.random() < 0.02) {
        ctx.fillStyle = "#ff99cc";
        ctx.font = "8px monospace";
        ctx.fillText("01LOVE"[Math.floor(Math.random() * 6)], p.x, p.y);
      }
    }

    function animate() {

      // ❌ 不再使用黑色覆盖
      // ctx.fillStyle = "rgba(0,0,0,0.2)";
      // ctx.fillRect(0, 0, width, height);

      // ✅ 改成轻微透明擦除
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += (p.tx - p.x) * p.speed;
        p.y += (p.ty - p.y) * p.speed;
        drawParticle(p);
      });

      requestAnimationFrame(animate);
    }


    animate();

  }, [text, size]);

  return (
    <div className="matrixTextWrap">
      <canvas ref={canvasRef} />
    </div>
  );
}
