import type { ButtonProps } from "@mui/material/Button";
import type { MetronomeRhythmStartedEvent } from "~/model";

//================================================

export type VisualizerNodeHandle = {
  setDelay: (event: MetronomeRhythmStartedEvent) => void;
  start: () => void;
  stop: () => void;
};

export type VisualizerProps = {
  size?: ButtonProps["size"] | number;
  subdivisions?: "separate" | "combined";
  beats?: "separate" | "combined";
};
