import { useState, useEffect, useRef } from "react"
import music from "./assets/music.mp3"
import "./index.css"
import ChristmasTree from "./components/ChristmasTree";
import TypeWriter from "./components/TypeWriter";
import SequentialTypewriter from "./components/SequentialTypewriter";

export default function App() {

  const [page, setPage] = useState(0)
  const [text, setText] = useState("")
  const audioRef = useRef(null)
  const [showFinal, setShowFinal] = useState(false)
  const [showFirework, setShowFirework] = useState(false)

  const message = `Lucia，
我知道我经常惹你生气,
让你时不时想动手揍我,
谢谢你一直包容我的傻里傻气，
也谢谢你时不时为我准备惊喜，
希望我的女孩能一直快乐下去，不要有忧伤，不要有烦恼，更加不要时不时心情不好。

从 2019年12月18日 到今天，
我最开心的事情，
就是身边的人一直是你。

爱你 臭🐖`

  const next = () => setPage(p => p + 1)

  const start = () => {
    audioRef.current.volume = 0.6
    audioRef.current.play()
    next()
  }

  // 打字机
  useEffect(() => {
    if (page === 4) {
      let i = 0
      const timer = setInterval(() => {
        setText(message.slice(0, i))
        i++
        if (i > message.length) clearInterval(timer)
      }, 120)

      return () => clearInterval(timer)
    }
  }, [page])

  // 🎆 粒子烟花
  useEffect(() => {
    if (!showFirework) return

    const canvas = document.getElementById("fireCanvas")
    const ctx = canvas.getContext("2d")

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Particle {
      constructor(x, y) {
        this.x = x
        this.y = y
        this.size = Math.random() * 2 + 1
        this.speedX = Math.random() * 8 - 4
        this.speedY = Math.random() * 8 - 4
        this.life = 100
        this.color = `hsl(${Math.random() * 360},100%,60%)`
      }
      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.life--
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    let particles = []

    function explode(x, y) {
      for (let i = 0; i < 150; i++) {

        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 6;

        const heartX = 16 * Math.pow(Math.sin(angle), 3);
        const heartY =
          -(13 * Math.cos(angle) -
            5 * Math.cos(2 * angle) -
            2 * Math.cos(3 * angle) -
            Math.cos(4 * angle));

        const p = new Particle(x, y);

        p.speedX = heartX * radius * 0.4;
        p.speedY = heartY * radius * 0.4;

        particles.push(p);
      }
    }

    function animate() {
      ctx.fillStyle = "rgba(0,0,0,0.2)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, index) => {
        p.update()
        p.draw()
        if (p.life <= 0) particles.splice(index, 1)
      })

      requestAnimationFrame(animate)
    }

    const timer = setInterval(() => {
      explode(
        Math.random() * canvas.width,
        Math.random() * canvas.height * 0.6
      )
    }, 700)

    animate()

    return () => clearInterval(timer)

  }, [showFirework])


  // 🌹 Canvas 玫瑰绽放
  useEffect(() => {

    if (!showFinal) return;

    const canvas = document.getElementById("roseCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const petals = [];

    class Petal {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 8 + 6;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.rotation = Math.random() * Math.PI;
        this.rotateSpeed = Math.random() * 0.02 - 0.01;
        this.alpha = Math.random() * 0.5 + 0.5;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = `rgba(255,60,120,${this.alpha})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotateSpeed;
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (petals.length < 250) {
        petals.push(new Petal());
      }

      petals.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.y > canvas.height + 50) petals.splice(i, 1);
      });

      requestAnimationFrame(animate);
    }

    animate();

  }, [showFinal]);

  // 💖 爱心粒子雨
  useEffect(() => {

    const canvas = document.getElementById("heartCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const hearts = [];

    class Heart {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 10 + 10;
        this.speed = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.5;
      }

      draw() {
        ctx.fillStyle = `rgba(255,80,150,${this.alpha})`;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.bezierCurveTo(
          this.x - this.size, this.y - this.size,
          this.x - this.size * 2, this.y + this.size,
          this.x, this.y + this.size * 2
        );
        ctx.bezierCurveTo(
          this.x + this.size * 2, this.y + this.size,
          this.x + this.size, this.y - this.size,
          this.x, this.y
        );
        ctx.fill();
      }

      update() {
        this.y -= this.speed;
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (hearts.length < 120) {
        hearts.push(new Heart());
      }

      hearts.forEach((h, i) => {
        h.update();
        h.draw();
        if (h.y < -50) hearts.splice(i, 1);
      });

      requestAnimationFrame(animate);
    }

    animate();

  }, []);


  return (
    <>
      <audio ref={audioRef} src={music} loop />
      {/* 💖 爱心粒子雨 */}
      <canvas id="heartCanvas"></canvas>
      {showFinal && <canvas id="roseCanvas"></canvas>}

      {/* 烟花 */}
      {showFirework && <canvas id="fireCanvas"></canvas>}

      {/* 0 */}
      {page === 0 && (
        <section className="fade">
          <SequentialTypewriter
            lines={[
              "Hi 臭猪猪 💖",
              "我为你准备了一段属于我们的故事"
            ]}
          />
          <button onClick={start}>准备好了吗 ▶</button>
        </section>
      )}

      {/* 1 */}
      {page === 1 && (
        <section className="fade">
          <SequentialTypewriter
            lines={[
              "我们的故事",
              "从 2019-12-18",
              "开始"
            ]}
          />
          <button onClick={next}>继续 ▶</button>
        </section>
      )}

      {/* 2 */}
      {page === 2 && (
        <section className="fade">
          <SequentialTypewriter
            lines={[
              "从那天开始",
              "我的世界",
              "多了一个名字陪着我"
            ]}
          />
          <button onClick={next}>继续 ▶</button>
        </section>
      )}

      {/* 3 */}
      {page === 3 && (
        <section className="fade">
          <h1>我们的糗事</h1>
          <ChristmasTree />
          <button onClick={next}>继续 ▶</button>
        </section>
      )}

      {/* 4 */}
      {page === 4 && (
        <section className="fade">
          <h1>想对你说</h1>
          <h2 className="type">{text}</h2>
          <button onClick={next}>继续 ▶</button>
        </section>
      )}

      {/* 5 */}
      {page === 5 && (
        <section className="fade">

          {!showFinal && (
            <>
              <SequentialTypewriter
                lines={[
                  "Lucia，你愿意继续牵着我的手走下去吗？",
                  "这里只有单选项噢？"
                ]}
              />

              <button onClick={() => {
                setShowFinal(true)
                setShowFirework(true)
              }}>
                我愿意
              </button>
            </>
          )}

          {showFinal && (
            <>

              <h1 className="finalText">
                情人节快乐 猪 ❤️
                <br />
                我会爱你很久很久的
              </h1>
            </>
          )}

        </section>
      )}

    </>
  )
}
