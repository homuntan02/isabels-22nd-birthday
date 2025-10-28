import { useState } from "react";
import StartScreen from "./StartScreen";
import World from "./World";
import './App.css';

function App() {
  const [started, setStarted] = useState(false);

  return started ? <World /> : <StartScreen onStart={() => setStarted(true)} />;
}

export default App;
