import { values } from "lodash";
import { useEffect } from "react";

import { Rhythm } from "~/model";
import {
  METRONOME_CONTAINER_ID,
  VOLUME_INTERVAL,
  VOLUME_JUMP_INTERVAL,
} from "~/utils/constants";
import { getBpmJumpInterval } from "~/utils/helpers";
import { useValueRef } from "~/utils/hooks";
import { KeybindAction } from "~/utils/types";
import { useAppState, useTapTempoContext } from "~/view/context";

//================================================

const keybindActions = values(KeybindAction);

const shouldIgnoreKeyPress = (e: KeyboardEvent) => {
  return (
    (e.target instanceof HTMLInputElement && e.key.startsWith("Arrow")) ||
    ((e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLButtonElement) &&
      !e.target.matches(`${METRONOME_CONTAINER_ID} *`))
  );
};

export function KeybindHandler() {
  const { metronome, setVolume, state } = useAppState();
  const { button } = useTapTempoContext();
  const { setBpm } = useAppState();

  const { keybinds } = state.data.settings;
  const keybindsRef = useValueRef(keybinds);

  const keybindCallbacks = useValueRef({
    [KeybindAction.PlayPause]: () =>
      metronome.playing
        ? metronome.stop()
        : metronome.start(
            new Rhythm(state.rhythm.timeSignature, state.rhythm.notes),
          ),

    [KeybindAction.BpmUp]: () => setBpm((prev) => prev + 1),

    [KeybindAction.BpmDown]: () => setBpm((prev) => prev - 1),

    [KeybindAction.BpmJumpUp]: () =>
      setBpm((prev) => prev + getBpmJumpInterval(prev, 1)),

    [KeybindAction.BpmJumpDown]: () =>
      setBpm((prev) => prev - getBpmJumpInterval(prev, -1)),

    [KeybindAction.VolumeUp]: () =>
      setVolume((prev) => prev + VOLUME_INTERVAL / 100),

    [KeybindAction.VolumeDown]: () =>
      setVolume((prev) => prev - VOLUME_INTERVAL / 100),

    [KeybindAction.VolumeJumpUp]: () =>
      setVolume((prev) => prev + VOLUME_JUMP_INTERVAL / 100),

    [KeybindAction.VolumeJumpDown]: () =>
      setVolume((prev) => prev - VOLUME_JUMP_INTERVAL / 100),

    [KeybindAction.TapTempo]: () => button?.click(),
  } satisfies Record<KeybindAction, () => void>);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (shouldIgnoreKeyPress(e)) {
        return;
      }

      for (const action of keybindActions) {
        const keybinds = keybindsRef.current[action];
        if (!keybinds) {
          continue;
        }

        if (
          keybinds.some(
            (keybind) =>
              keybind.key === e.key &&
              !!keybind.altKey === e.altKey &&
              !!keybind.ctrlKey === e.ctrlKey &&
              !!keybind.metaKey === e.metaKey &&
              !!keybind.shiftKey === e.shiftKey,
          )
        ) {
          e.preventDefault();
          e.stopPropagation();
          keybindCallbacks.current[action]();
          return;
        }
      }
    };

    window.addEventListener("keydown", listener, { capture: true });
    return () =>
      window.removeEventListener("keydown", listener, {
        capture: true,
      });
  }, [keybindCallbacks, keybindsRef]);

  return null;
}
