import { useAppState } from "~/view/context";

import { TimeSignatureControl } from "./TimeSignature";

//================================================

export function RhythmControls() {
  const { state, setTimeSignature } = useAppState();
  return (
    <TimeSignatureControl
      value={state.measures[0].timeSignature}
      onChange={setTimeSignature}
    />
  );
}
