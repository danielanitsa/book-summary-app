import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface TypewriterProps {
  text: string;
  speed: number;
}

const TypewriterMarkdown: React.FC<TypewriterProps> = ({ text, speed }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index === text.length) {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className="typewriter-container">
      <ReactMarkdown>{displayedText}</ReactMarkdown>
      <svg
        viewBox="8 4 8 16"
        xmlns="http://www.w3.org/2000/svg"
        className="cursor"
      >
        <rect x="10" y="6" width="4" height="12" fill="#fff" />
      </svg>
    </div>
  );
};

export default TypewriterMarkdown;
