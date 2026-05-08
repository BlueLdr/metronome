import { VolumeSlider } from "~/view/components/common";
import { useAppState } from "~/view/context";

import type { VolumeSliderProps } from "~/view/components/common";
import type { DistributiveOmit } from "~/utils/types";

//================================================

export type MasterVolumeSliderProps = DistributiveOmit<
  VolumeSliderProps,
  "value" | "onChange" | "iconMin" | "iconMax"
>;

export function MasterVolumeSlider(props: MasterVolumeSliderProps) {
  const { state, setVolume } = useAppState();

  return (
    <VolumeSlider
      {...props}
      value={state.volume}
      onChange={(_, value) => {
        if (typeof value === "number") {
          setVolume(value);
        }
      }}
    />
  );
}
