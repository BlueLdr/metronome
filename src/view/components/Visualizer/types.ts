import type { ButtonProps } from "@mui/material/Button";
import type { MetronomeMeasureStartedEvent } from "~/model";

//================================================

export type VisualizerNodeHandle = {
  setDelay: (event: MetronomeMeasureStartedEvent) => void;
  start: () => void;
  stop: () => void;
};

export type VisualizerProps = {
  size?: ButtonProps["size"] | number;
  subdivisions?: "separate" | "combined";
  beats?: "separate" | "combined";
};
