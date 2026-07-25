import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { calculateBeats } from "~/utils/helpers";
import { useValueRef } from "~/utils/hooks";
import { useAppState } from "~/view/context";

import { VisualizerNode } from "./VisualizerNode";

import Grid from "@mui/material/Grid";

import type { MetronomeRhythmStartedEvent } from "~/model";
import type { VisualizerNodeHandle, VisualizerProps } from "./types";

//================================================

export function Visualizer({
  size,
  subdivisions,
  beats: beatsLayout,
}: VisualizerProps) {
  const { metronome, state } = useAppState();
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [nodes, setNodes] = useState<Map<number, VisualizerNodeHandle | null>>(
    () => new Map(),
  );
  const originalRhythmDuration = useRef<number | undefined>(undefined);

  const nodeRef = useCallback(
    (index: number, handle: VisualizerNodeHandle | null) => {
      setNodes((map) => {
        const newMap = new Map(map);
        newMap.set(index, handle);
        return newMap;
      });
    },
    [],
  );

  const nodesRef = useValueRef(nodes);
  useEffect(() => {
    const listener = (e: MetronomeRhythmStartedEvent) => {
      if (!rootRef) {
        return;
      }
      nodesRef.current.forEach((handle) => {
        handle?.stop();
      });
      rootRef.style.setProperty(
        "--visualizer-rhythm-duration",
        `${e.rhythm.duration}ms`,
      );
      requestAnimationFrame(() => {
        nodesRef.current.forEach((handle) => {
          handle?.setDelay(e);
          handle?.start();
        });
      });
    };

    const stopListener = () => {
      originalRhythmDuration.current = undefined;
      nodesRef.current.forEach((handle) => {
        handle?.stop();
      });
    };
    metronome.on("rhythm-started", listener);
    metronome.on("stop", stopListener);
    return () => {
      metronome.off("rhythm-started", listener);
      metronome.off("stop", stopListener);
    };
  }, [metronome, rootRef, nodesRef]);

  const beats = useMemo(
    () => calculateBeats(state.measures[0]),
    [state.measures],
  );
  const combineBeats = beatsLayout === "combined";

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      position={combineBeats ? "relative" : undefined}
      gap={4}
      ref={setRootRef}
    >
      {state.measures[0].notes.map((_, index) =>
        !beats[index] &&
        (subdivisions !== "separate" || combineBeats) ? null : (
          <VisualizerNode
            key={index}
            handleRef={nodeRef}
            beat={beats[index]}
            index={index}
            measure={state.measures[0]}
            size={size}
            subdivisions={
              combineBeats && subdivisions === "separate"
                ? "combined"
                : subdivisions
            }
            beatsCombined={combineBeats}
          />
        ),
      )}
    </Grid>
  );
}
