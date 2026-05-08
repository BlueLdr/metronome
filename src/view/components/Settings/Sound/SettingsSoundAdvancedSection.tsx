import { styled } from "@mui/material/styles";

import { VolumeSlider } from "~/view/components/common";
import { useAppState } from "~/view/context";

import { SettingsSoundSelector } from "./SettingsSoundSelector";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import type { SoundSettings } from "~/utils/types";

//================================================

const CardContentFlex = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
});

type AdvancedSoundSettingsPartProps = {
  part: keyof SoundSettings;
  label: string;
};

function AdvancedSoundSettingsPart({
  part,
  label,
}: AdvancedSoundSettingsPartProps) {
  const { state, setSound, setSoundVolume } = useAppState();

  return (
    <Card variant="elevation" elevation={4}>
      <CardHeader
        title={label}
        slotProps={{ title: { variant: "subtitle1" } }}
      />
      <CardContentFlex sx={{ gap: 4 }}>
        <SettingsSoundSelector
          {...(part === "base"
            ? {
                value: state.data.settings.sounds[part].sound,
                onChange: (value) => setSound({ part, value }),
                required: true,
              }
            : {
                value: state.data.settings.sounds[part].sound ?? null,
                onChange: (value) => setSound({ part, value }),
                required: false,
              })}
        />
        <Grid
          component="label"
          container
          justifyContent="space-between"
          alignItems="center"
          gap={8}
        >
          <Typography variant="body1" flexShrink={1} flexGrow={0}>
            Volume
          </Typography>
          <VolumeSlider
            containerProps={{ flex: 1 }}
            value={state.data.settings.sounds[part].volume}
            onChange={(_, value) =>
              typeof value === "number"
                ? setSoundVolume(part, value)
                : undefined
            }
          />
        </Grid>
      </CardContentFlex>
    </Card>
  );
}

export function SettingsSoundAdvancedSection() {
  return (
    <>
      <AdvancedSoundSettingsPart part="base" label="Beat" />
      <AdvancedSoundSettingsPart part="firstBeat" label="First beat" />
      <AdvancedSoundSettingsPart part="subdivision" label="Subdivisons" />
    </>
  );
}
