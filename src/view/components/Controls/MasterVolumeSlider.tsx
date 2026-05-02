import { VolumeSlider } from "~/view/components/common";
import { useAppState } from "~/utils/hooks";

import type { VolumeSliderProps } from "~/view/components/common";
import type { DistributiveOmit } from "~/utils/types";

//================================================

export type MasterVolumeSliderProps = DistributiveOmit<
  VolumeSliderProps,
  "value" | "onChange" | "iconMin" | "iconMax"
>;

export function MasterVolumeSlider(props: MasterVolumeSliderProps) {
  const { volume, setVolume } = useAppState();

  return (
    <VolumeSlider
      {...props}
      value={volume}
      onChange={(_, value) => {
        if (typeof value === "number") {
          setVolume(value);
        }
      }}
    />
  );
}
