import { useEffect, useRef, useState, useMemo } from "react";
import bg from "./assets/bg_long.png";
import stand from "./assets/stand.png";
import walkRight from "./assets/walk-right.png";
import walkLeft from "./assets/walk-left.png";
import signImg from "./assets/signboard.png";
import Popup01 from "./popups/popup-01";
import Popup02 from "./popups/popup-02";
import Popup03 from "./popups/popup-03";
import Popup04 from "./popups/popup-04";
import Popup05 from "./popups/popup-05";
import Popup06 from "./popups/popup-06";
import Popup07 from "./popups/popup-07";
import Popup08 from "./popups/popup-08";
import Popup09 from "./popups/popup-09";
import Popup10 from "./popups/popup-10";
import Popup11 from "./popups/popup-11";
import Popup12 from "./popups/popup-12";
import Popup13 from "./popups/popup-13";
import Popup14 from "./popups/popup-14";
import Popup15 from "./popups/popup-15";
import Popup16 from "./popups/popup-16";
import Popup17 from "./popups/popup-17";
import Popup18 from "./popups/popup-18";
import Popup19 from "./popups/popup-19";

export default function World() {
  const [x, setX] = useState(0);
  const [direction, setDirection] = useState("stand");
  const [openSignId, setOpenSignId] = useState(null);
  const isAnyModalOpen = !!openSignId;
  const timeoutRef = useRef(null);

  const step = 60;
  const maxXRef = useRef(36500);

  // ---- Signboard placement/config ----
  const interactRadius = 250;

  // Describe each sign: id, world x-position, and which popup component to show
  const signs = useMemo(
    () => [
      { id: "sign-1",  x: 1875,  bottom: 26, heightVh: 30, Popup: Popup01 },
      { id: "sign-2",  x: 3750,  bottom: 26, heightVh: 30, Popup: Popup02 },
      { id: "sign-3",  x: 5475,  bottom: 26, heightVh: 30, Popup: Popup03 },
      { id: "sign-4",  x: 7250,  bottom: 26, heightVh: 30, Popup: Popup04 },
      { id: "sign-5",  x: 9125,  bottom: 26, heightVh: 30, Popup: Popup05 },
      { id: "sign-6",  x: 10900, bottom: 26, heightVh: 30, Popup: Popup06 },
      { id: "sign-7",  x: 12675, bottom: 26, heightVh: 30, Popup: Popup07 },
      { id: "sign-8",  x: 14450, bottom: 26, heightVh: 30, Popup: Popup08 },
      { id: "sign-9",  x: 16225, bottom: 26, heightVh: 30, Popup: Popup09 },
      { id: "sign-10", x: 18000, bottom: 26, heightVh: 30, Popup: Popup10 },
      { id: "sign-11", x: 19775, bottom: 26, heightVh: 30, Popup: Popup11 },
      { id: "sign-12", x: 21550, bottom: 26, heightVh: 30, Popup: Popup12 },
      { id: "sign-13", x: 23325, bottom: 26, heightVh: 30, Popup: Popup13 },
      { id: "sign-14", x: 25100, bottom: 26, heightVh: 30, Popup: Popup14 },
      { id: "sign-15", x: 26875, bottom: 26, heightVh: 30, Popup: Popup15 },
      { id: "sign-16", x: 28650, bottom: 26, heightVh: 30, Popup: Popup16 },
      { id: "sign-17", x: 30425, bottom: 26, heightVh: 30, Popup: Popup17 },
      { id: "sign-18", x: 32200, bottom: 26, heightVh: 30, Popup: Popup18 },
      { id: "sign-19", x: 36650, bottom: 26, heightVh: 30, Popup: Popup19 },
    ],
    []
  );

  // Compute distances / nearest sign (after signs exist)
  const { nearest, nearAny, hintDX } = useMemo(() => {
    if (!signs.length) return { nearest: null, nearAny: false, hintDX: 0 };
    const distances = signs.map(s => ({ id: s.id, dx: s.x - x, dist: Math.abs(s.x - x) }));
    const nearestLocal = distances.reduce((a, b) => (a && a.dist < b.dist ? a : b), null);
    const nearAnyLocal = !!nearestLocal && nearestLocal.dist <= interactRadius;
    const hintDXLocal = nearAnyLocal ? nearestLocal.dx : 0;
    return { nearest: nearestLocal, nearAny: nearAnyLocal, hintDX: hintDXLocal };
  }, [x, signs, interactRadius]);

  // cleanup timer
  useEffect(() => () => timeoutRef.current && clearTimeout(timeoutRef.current), []);

  const setStandSoon = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setDirection("stand"), 250);
  };

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const moveLeft = () => {
    if (isAnyModalOpen) return;
    setX(prev => clamp(prev - step, 0, maxXRef.current));
    setDirection("left");
    setStandSoon();
  };

  const moveRight = () => {
    if (isAnyModalOpen) return;
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
        if (!isAnyModalOpen && nearAny && nearest) setOpenSignId(nearest.id);
      } else if (k === "escape") {
        if (isAnyModalOpen) setOpenSignId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nearAny, nearest, isAnyModalOpen]); // nearest is fine here; it's memoized

  const sprite = direction === "left" ? walkLeft : direction === "right" ? walkRight : stand;

  return (
    <div
      className="world"
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "auto 100%",
        backgroundPosition: `${-x}px bottom`,
        backgroundRepeat: "no-repeat",
        transition: isAnyModalOpen ? "none" : "background-position 0.2s linear",
      }}
    >
      {/* Signboards */}
      {signs.map((s) => {
        const dx = s.x - x; // offset from player center
        const isNear = Math.abs(dx) <= interactRadius;

        return (
          <img
            key={s.id}
            src={signImg}
            alt="Signboard"
            onClick={() => { if (!isAnyModalOpen && isNear) setOpenSignId(s.id); }}
            style={{
              position: "absolute",
              bottom: `${s.bottom ?? 26}vh`,
              left: "50%",
              transform: `translateX(${dx}px) translateX(-50%)`,
              transition: "transform 0.2s linear",
              willChange: "transform",
              height: `${s.heightVh ?? 30}vh`,
              width: "auto",
              imageRendering: "pixelated",
              cursor: isNear ? "pointer" : "default",
              filter: isNear ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" : "none",
              zIndex: 2,
            }}
          />
        );
      })}

      {/* “Press E” hint near the nearest sign */}
      {nearAny && !isAnyModalOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "50vh",
            left: "50%",
            transform: `translateX(${hintDX}px) translateX(-50%)`,
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

      {/* Popups (render only the one whose id matches openSignId) */}
      {signs.map((s) => {
        const { Popup } = s;
        const open = openSignId === s.id;
        if (!open) return null;
        return (
          <Popup
            key={s.id}
            open={open}
            onClose={() => setOpenSignId(null)}
          />
        );
      })}
    </div>
  );
}
