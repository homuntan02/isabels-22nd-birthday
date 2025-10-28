import { useEffect, useRef, useState } from "react";
import bg from "./assets/bg.png";
import stand from "./assets/stand.png";      // standing sprite
import walkRight from "./assets/walk-right.png"; // walking right sprite
import walkLeft from "./assets/walk-left.png";   // walking left sprite

export default function World() {
  const [x, setX] = useState(0);                 // horizontal scroll position
  const [direction, setDirection] = useState("stand"); // stand | left | right
  const timeoutRef = useRef(null);
  const step = 60;                                // pixels per tap/press
  const maxXRef = useRef(8000);                   // “virtual world” width (pixels). tune as you like.

  // Clean up any pending timeouts so the sprite doesn't get stuck between states
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const setStandSoon = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setDirection("stand"), 250);
  };

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const moveLeft = () => {
    setX(prev => {
      const next = clamp(prev - step, 0, maxXRef.current);
      return next;
    });
    setDirection("left");
    setStandSoon();
  };

  const moveRight = () => {
    setX(prev => {
      const next = clamp(prev + step, 0, maxXRef.current);
      return next;
    });
    setDirection("right");
    setStandSoon();
  };

  // Keyboard arrows or A/D
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        e.preventDefault();
        moveLeft();
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        e.preventDefault();
        moveRight();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveLeft, moveRight]);

  const sprite =
    direction === "left" ? walkLeft : direction === "right" ? walkRight : stand;

  return (
    <div
      className="world"
      // We scroll the background by changing backgroundPositionX; no giant inner bg div needed.
      style={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: "repeat-x",
        // Preserve aspect ratio by fitting the bg’s HEIGHT to the viewport; width scales proportionally and then repeats.
        backgroundSize: "auto 100%",
        backgroundPosition: `${-x}px bottom`,
        transition: "background-position 0.2s linear",
      }}
    >
      <img
        src={sprite}
        className="character"
        alt="player"
        style={{
          position: "absolute",
          // keep the character anchored near “ground”
          bottom: "25vh",
          left: "50%",
          transform: "translateX(-50%)",
          // scale with viewport height to keep aspect ratio natural on all screens
          height: "22vh",
          width: "auto",
          // crisp pixel-art look; remove if your art isn’t pixel style
          imageRendering: "pixelated",
          // a touch of smoothness when swapping sprites
          transition: "transform 80ms ease, opacity 80ms ease",
          // a tiny “pop” when moving (optional flair)
          ...(direction !== "stand" ? { transform: "translateX(-50%) scale(1.02)" } : null),
          pointerEvents: "none",
        }}
      />

      <div className="controls">
        <button onClick={moveLeft} aria-label="Move Left">◀</button>
        <button onClick={moveRight} aria-label="Move Right">▶</button>
      </div>
    </div>
  );
}
