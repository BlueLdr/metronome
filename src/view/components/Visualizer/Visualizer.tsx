import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { calculateBeats } from "~/utils/helpers";
import { useValueRef } from "~/utils/hooks";
import { useAppState } from "~/view/context";

import { VisualizerNode } from "./VisualizerNode";

import Grid from "@mui/material/Grid";

import type { MetronomeMeasureStartedEvent } from "~/model";
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
  const originalMeasureDuration = useRef<number | undefined>(undefined);

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
    const listener = (e: MetronomeMeasureStartedEvent) => {
      if (!rootRef) {
        return;
      }
      rootRef.style.setProperty(
        "--visualizer-measure-duration",
        `${e.measure.duration}ms`,
      );
      nodesRef.current.forEach((handle) => {
        handle?.setDelay(e);
        handle?.start();
      });
    };

    const stopListener = () => {
      originalMeasureDuration.current = undefined;
      nodesRef.current.forEach((handle) => {
        handle?.stop();
      });
    };
    metronome.on("measure-started", listener);
    metronome.on("stop", stopListener);
    return () => {
      metronome.off("measure-started", listener);
      metronome.off("stop", stopListener);
    };
  }, [metronome, rootRef, nodesRef]);

  const beats = useMemo(() => calculateBeats(state.rhythm), [state.rhythm]);
  const combineBeats = beatsLayout === "combined";
  console.log(`beats: `, beats);

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      position={combineBeats ? "relative" : undefined}
      gap={4}
      ref={setRootRef}
    >
      {state.rhythm.notes.map((_, index) =>
        !beats[index] &&
        (subdivisions !== "separate" || combineBeats) ? null : (
          <VisualizerNode
            key={index}
            handleRef={nodeRef}
            beat={beats[index]}
            index={index}
            rhythm={state.rhythm}
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
