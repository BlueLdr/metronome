import { useAppState } from "~/view/context";

import { TimeSignatureControl } from "./TimeSignature";

//================================================

export function RhythmControls() {
  const { state, setTimeSignature } = useAppState();
  return (
    <TimeSignatureControl
      value={state.rhythm.timeSignature}
      onChange={setTimeSignature}
    />
  );
}
