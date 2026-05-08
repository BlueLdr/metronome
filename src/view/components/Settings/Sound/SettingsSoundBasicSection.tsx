import { DEFAULT_SOUND_SETTINGS, DEFAULT_VOLUME } from "~/utils/constants";
import { useAppState } from "~/view/context";

import { SettingsSoundSelector } from "./SettingsSoundSelector";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";

//================================================

export function SettingsSoundBasicSection() {
  const { state, setSoundSettings } = useAppState();

  const emphasizeFirstBeat =
    state.data.settings.sounds.firstBeat.volume ===
    DEFAULT_SOUND_SETTINGS.firstBeat.volume;

  const deemphasizeSubdivisions =
    state.data.settings.sounds.subdivision.volume ===
    DEFAULT_SOUND_SETTINGS.subdivision.volume;
  return (
    <>
      <SettingsSoundSelector
        value={state.data.settings.sounds.base.sound}
        onChange={(newSound) =>
          setSoundSettings((prev) => ({
            ...prev,
            base: {
              ...prev.base,
              sound: newSound,
            },
            firstBeat: {
              ...prev.firstBeat,
              sound: undefined,
            },
            subdivision: {
              ...prev.subdivision,
              sound: undefined,
            },
          }))
        }
        required
      />
      <Grid>
        <Grid component="label" container gap={4} alignItems="center">
          <Switch
            checked={emphasizeFirstBeat}
            onChange={(_, checked) =>
              setSoundSettings((prev) => ({
                ...prev,
                base: {
                  ...prev.base,
                  volume: checked
                    ? DEFAULT_SOUND_SETTINGS.base.volume
                    : DEFAULT_VOLUME,
                },
                firstBeat: {
                  ...prev.firstBeat,
                  volume: checked
                    ? DEFAULT_SOUND_SETTINGS.firstBeat.volume
                    : DEFAULT_VOLUME,
                },
                subdivision: {
                  ...prev.subdivision,
                  volume: deemphasizeSubdivisions
                    ? DEFAULT_SOUND_SETTINGS.subdivision.volume
                    : checked
                      ? DEFAULT_SOUND_SETTINGS.base.volume
                      : DEFAULT_VOLUME,
                },
              }))
            }
          />
          <Typography variant="body1">Emphasize first beat</Typography>
        </Grid>
        <Grid component="label" container gap={4} alignItems="center">
          <Switch
            checked={
              state.data.settings.sounds.subdivision.volume ===
              DEFAULT_SOUND_SETTINGS.subdivision.volume
            }
            onChange={(_, checked) =>
              setSoundSettings((prev) => ({
                ...prev,
                subdivision: {
                  ...prev.subdivision,
                  volume: checked
                    ? DEFAULT_SOUND_SETTINGS.subdivision.volume
                    : emphasizeFirstBeat
                      ? DEFAULT_SOUND_SETTINGS.base.volume
                      : DEFAULT_VOLUME,
                },
              }))
            }
          />
          <Typography variant="body1">De-emphasize subdivisions</Typography>
        </Grid>
      </Grid>
    </>
  );
}
