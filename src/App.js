import { useRef, useState } from "react";
import StartScreen from "./StartScreen";
import World from "./World";
import "./App.css";
import theme from "./assets/theme.mp3"

function App() {
  const [started, setStarted] = useState(false);
  const audioRef = useRef(null); // keep the audio alive across screens

  const handleStart = async () => {
    // create & play on first user gesture (this click)
    if (!audioRef.current) {
      const el = new Audio(theme);
      el.loop = true;
      el.volume = 0.7;
      try { await el.play(); } catch {}
      audioRef.current = el;
    }
    setStarted(true);
  };

  return started ? <World /> : <StartScreen onStart={handleStart} />;
}

export default App;
