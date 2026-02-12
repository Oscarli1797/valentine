import { useEffect, useState } from "react";

export default function TypeWriter({
  text,
  speed = 80,
  className = ""
}) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    let i = 0;
    setOutput("");

    const timer = setInterval(() => {
      setOutput(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <h1 className={`typewriter ${className}`}>
      {output}
    </h1>
  );
}
