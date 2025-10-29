import { useEffect, useRef, useState, useMemo } from "react";
import bg from "./assets/start.png";
import stand from "./assets/stand.png";
import walkRight from "./assets/walk-right.png";
import walkLeft from "./assets/walk-left.png";
import signImg from "./assets/signboard.png"; // <-- add this image
import zoomedSign from "./assets/zoomedsignboard.png";

export default function World() {
  const [x, setX] = useState(0);                  // world position (player stays centered; world scrolls)
  const [direction, setDirection] = useState("stand");
  const [isSignOpen, setIsSignOpen] = useState(false);
  const timeoutRef = useRef(null);

  const step = 60;
  const maxXRef = useRef(8000);

  // ---- Signboard placement/config ----
  const signX = 600;              // world coordinate for the sign
  const interactRadius = 150;      // how close the player must be to interact
  const nearSign = Math.abs(x - signX) <= interactRadius;
  const signDX = signX - x; // how far the sign is from the center


  // cleanup timer
  useEffect(() => () => timeoutRef.current && clearTimeout(timeoutRef.current), []);

  const setStandSoon = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setDirection("stand"), 250);
  };

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const moveLeft = () => {
    if (isSignOpen) return; // freeze movement while modal open
    setX(prev => clamp(prev - step, 0, maxXRef.current));
    setDirection("left");
    setStandSoon();
  };

  const moveRight = () => {
    if (isSignOpen) return;
    setX(prev => clamp(prev + step, 0, maxXRef.current));
    setDirection("right");
    setStandSoon();
  };

  // Keyboard: arrows/A/D to move; E to open; Esc to close
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") { e.preventDefault(); moveLeft(); }
      else if (k === "arrowright" || k === "d") { e.preventDefault(); moveRight(); }
      else if (k === "e") {
        if (!isSignOpen && nearSign) setIsSignOpen(true);
      } else if (k === "escape") {
        if (isSignOpen) setIsSignOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nearSign, isSignOpen]);

  const sprite = direction === "left" ? walkLeft : direction === "right" ? walkRight : stand;

  // Screen position of the sign (player is centered at 50vw)
  const signScreenLeft = `calc(50vw + ${signX - x}px)`;

  return (
    <div
      className="world"
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%",
        backgroundPosition: `${-x}px bottom`,
        transition: isSignOpen ? "none" : "background-position 0.2s linear",
      }}
    >
      {/* Signboard */}
      <img
        src={signImg}
        alt="Signboard"
        onClick={() => {
          if (nearSign) setIsSignOpen(true);
        }}
        style={{
          position: "absolute",
          bottom: "26vh",
          left: "50%",
          transform: `translateX(${signDX}px) translateX(-50%)`,
          transition: "transform 0.2s linear",
          willChange: "transform",
          height: "30vh",
          width: "auto",
          imageRendering: "pixelated",
          cursor: nearSign ? "pointer" : "default",
          filter: nearSign
            ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
            : "none",
          zIndex: 2,
        }}
      />


      {/* “Press E” hint when near the sign */}
      {nearSign && !isSignOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "50vh",
            left: "50%",
            transform: `translateX(${signDX}px) translateX(-50%)`,
            transition: "transform 0.2s linear",
            padding: "6px 10px",
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            borderRadius: 8,
            fontSize: 14,
            zIndex: 2,
            userSelect: "none",
          }}
        >
          Press E to read
        </div>
      )}

      {/* CHARACTER */}
      <img
        src={sprite}
        alt="player"
        style={{
          position: "absolute",
          bottom: "25vh",
          left: "50%",
          transform: "translateX(-50%)",
          height: "22vh",
          width: "auto",
          imageRendering: "pixelated",
          transition: "transform 80ms ease",
          ...(direction !== "stand" ? { transform: "translateX(-50%) scale(1.02)" } : null),
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* CONTROLS */}
      <div
        className="controls"
        style={{
          position: "absolute",
          bottom: "2vh",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 12,
          zIndex: 3,
        }}
      >
        <button onClick={moveLeft} aria-label="Move Left">◀</button>
        <button onClick={moveRight} aria-label="Move Right">▶</button>
      </div>

      {/* MODAL OVERLAY (blur the world behind) */}
      {isSignOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsSignOpen(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(4px)",   // Safari/Chrome support; fine on iOS too
            display: "grid",
            placeItems: "center",
            zIndex: 5,
          }}
        >
          {/* Stop clicks inside the panel from closing */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(100vw, 1000px)",
              maxHeight: "78vh",
              background: "rgba(255, 255, 255, 0.15)",  // mostly transparent
              border: "1px solid rgba(255,255,255,0.3)", // subtle glass border
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              position: "relative",
              display: "grid",
              gap: 12,
            }}
          >
            {/* Close button (X) */}
            <button className="close-btn" onClick={() => setIsSignOpen(false)}>✕</button>

            {/* Zoomed sign image */}
            <img
              src={zoomedSign}
              alt="Sign"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 12,
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
