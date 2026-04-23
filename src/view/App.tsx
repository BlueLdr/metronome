import { useState } from "react";
import { Metronome, Rhythm } from "../model";
import { Sound } from "../model/sound.ts";
import { TEMP_CLICK_SOUND_URL } from "../utils/constants.ts";

const sound = new Sound("click", TEMP_CLICK_SOUND_URL);

function App() {
  const [rhythm] = useState(
    () =>
      new Rhythm({ count: 4, division: 4 }, [
        { sound, volume: 1, interval: 0.25 },
        { sound, volume: 0.25, interval: 0.25 },
        { sound, volume: 0.25, interval: 0.25 },
        { sound, volume: 0.25, interval: 0.25 },
      ]),
  );

  const [playing, setPlaying] = useState(false);
  const [bpm] = useState(120);
  const [metronome] = useState(
    () => new Metronome({ bpm, setPlaying, beatDivision: 4 }),
  );

  return (
    <>
      hello
      <button
        onClick={() => (playing ? metronome.stop() : metronome.start(rhythm))}
      >
        Click
      </button>
    </>
  );
}

export default App;
