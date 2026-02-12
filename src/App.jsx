import { useState, useEffect, useRef } from "react";
import music from "./assets/music.mp3";
import "./index.css";

import BackgroundSystem from "./components/BackgroundSystem";
import ChristmasTree from "./components/ChristmasTree";
import Bubu3D from "./components/Bubu3D";
import MatrixText from "./components/MatrixText";
import Stage from "./components/Stage";

export default function App() {

  const [page, setPage] = useState(0);
  const audioRef = useRef(null);

  const [showFinal, setShowFinal] = useState(false);
  const [showFirework, setShowFirework] = useState(false);
  const loveLines = [
    "Lucia，",
    "我知道我经常惹你生气，",
    "让你时不时想动手揍我，",
    "谢谢你一直包容我的傻里傻气，",
    "时不时为我准备惊喜，",
    "经常给我做我爱吃的美食，",
    "新的一年里，我希望我的女孩能",
    "没有忧心事",
    "不会独自忧伤",
    "因为我会陪在你身边",
    "从 2019年12月18日 到今天，",
    "我最开心也最骄傲的事情，",
    "就是身边的人始终是你。",
    "爱你 臭🐖"
  ];

  const next = () => setPage(p => p + 1);
  const [lineIndex, setLineIndex] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(false);

  const start = () => {
    audioRef.current.volume = 0.6;
    audioRef.current.play();
    next();
  };

  useEffect(() => {
    if (!autoPlaying) return;

    if (lineIndex >= loveLines.length - 1) return;

    const timer = setTimeout(() => {
      setLineIndex(i => i + 1);
    }, 9000); // 每句话停留时间（可以改成 2200 / 3000）

    return () => clearTimeout(timer);

  }, [autoPlaying, lineIndex]);


  return (
    <>
      <BackgroundSystem
        showFirework={showFirework}
        showFinal={showFinal}
      />

      <audio ref={audioRef} src={music} loop />

      {/* ===== Page 0 ===== */}
      {page === 0 && (
        <Stage>
          <MatrixText text="Hi 臭猪猪 ❤" fontSize={80} />
          <MatrixText text="我为你准备了一段属于我们的故事" fontSize={12} />

          <button className="enterBtn" onClick={start}>
            ENTER ▶
          </button>
        </Stage>
      )}

      {/* ===== Page 1 ===== */}
      {page === 1 && (
        <Stage>
          <MatrixText text="我们的故事" fontSize={54} />
          <MatrixText text="从 2019 开始" fontSize={30} />

          <button className="enterBtn" onClick={next}>继续 ▶</button>
        </Stage>
      )}

      {/* ===== Page 2 ===== */}
      {page === 2 && (
        <Stage>
          <MatrixText text="一次程序的意外" fontSize={48} />
          <MatrixText text="却变成了命运的安排" fontSize={34} />

          <Bubu3D />

          <button className="enterBtn" onClick={next}>继续 ▶</button>
        </Stage>
      )}

      {/* ===== Page 3 ===== */}
      {page === 3 && (
        <Stage>
          <MatrixText text="后来我们经历了很多" fontSize={46} />
          <MatrixText text="有时开心 · 有时难过" fontSize={32} />

          <ChristmasTree />

          <button className="enterBtn" onClick={next}>继续 ▶</button>
        </Stage>
      )}

      {/* ===== Page 4 ===== */}
      {page === 4 && (
        <Stage>
          {!autoPlaying ? (
            <>
              <MatrixText text="但我想对你说" fontSize={52} />

              <button
                className="enterBtn"
                onClick={() => {
                  setAutoPlaying(true);
                  setLineIndex(0);
                }}
              >
                听我说完 ▶
              </button>
            </>
          ) : (
            <>
              <MatrixText
                key={lineIndex}   // ← 必须有，让Matrix重新聚合
                text={loveLines[lineIndex]}
                fontSize={36}
              />

              {lineIndex === loveLines.length - 1 && (
                <button className="enterBtn" onClick={next}>
                  继续 ▶
                </button>
              )}
            </>
          )}
        </Stage>
      )}


      {/* ===== Final ===== */}
      {page === 5 && (
        <Stage>
          {!showFinal && (
            <>
              <MatrixText text="Lucia" fontSize={54} />
              <MatrixText text="你愿意继续牵着我的手走下去吗？" fontSize={24} />

              <button
                className="enterBtn"
                onClick={() => {
                  setShowFinal(true);
                  setShowFirework(true);
                }}
              >
                我愿意 ❤
              </button>
            </>
          )}

          {showFinal && (
            <MatrixText text="我会爱你很久很久" fontSize={60} />
          )}
        </Stage>
      )}
    </>
  );
}
