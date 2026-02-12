import { useState, useEffect } from "react";

export default function SequentialTypewriter({
  lines = [],
  speed = 80,
  gap = 400
}) {
  const [currentLine, setCurrentLine] = useState(0);
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (currentLine >= lines.length) return;

    let i = 0;
    setOutput("");

    const timer = setInterval(() => {
      setOutput(lines[currentLine].slice(0, i));
      i++;

      if (i > lines[currentLine].length) {
        clearInterval(timer);
        setTimeout(() => {
          setCurrentLine(c => c + 1);
        }, gap);
      }
    }, speed);

    return () => clearInterval(timer);

  }, [currentLine, lines, speed, gap]);

  return (
    <div>
      {lines.slice(0, currentLine).map((l, i) => (
        <h1 key={i} className="typewriter">{l}</h1>
      ))}

      {currentLine < lines.length && (
        <h1 className="typewriter">{output}</h1>
      )}
    </div>
  );
}
