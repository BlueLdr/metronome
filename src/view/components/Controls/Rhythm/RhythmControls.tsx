import { useAppTimeSignatureState } from "~/utils/hooks/useAppState";

import { TimeSignatureControl } from "./TimeSignature";

//================================================

export function RhythmControls() {
  const [timeSignature, setTimeSignature] = useAppTimeSignatureState();
  return (
    <TimeSignatureControl value={timeSignature} onChange={setTimeSignature} />
  );
}
