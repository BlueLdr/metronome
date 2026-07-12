import { DEFAULT_SOUND_SETTINGS } from "~/utils/constants";
import { createRhythm } from "~/utils/helpers";
import {
  RhythmStaff,
  TimeSignatureFractionText,
} from "~/view/components/common";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";

import type { CardProps } from "@mui/material/Card";
import type { MetronomePreset } from "~/utils/types";
import type { NewMetronomePreset } from "./CreateUpdatePresetModal";

//================================================

export type PresetSummaryProps = CardProps & {
  preset: MetronomePreset | NewMetronomePreset;
  hideTitle?: boolean;
};

export function PresetSummary({
  preset,
  hideTitle,
  ...props
}: PresetSummaryProps) {
  return (
    <Card {...props}>
      {preset.name && !hideTitle && <CardHeader title={preset.name} />}
      <CardContent>
        <Grid
          container
          display="grid"
          gridTemplateColumns="auto auto auto"
          spacing={4}
        >
          <Typography>
            BPM: <strong>{preset.tempo.bpm}</strong>
          </Typography>
          <Typography component="div" display="inline-flex" columnGap=".4em">
            Time signature:{" "}
            <TimeSignatureFractionText timeSignature={preset.timeSignature} />
          </Typography>
          <Typography>
            Subdivision: <strong>{preset.subdivisionCount}</strong>
          </Typography>
        </Grid>
        <Grid mx="auto" width="fit-content">
          <RhythmStaff
            rhythm={createRhythm(
              preset.timeSignature,
              DEFAULT_SOUND_SETTINGS,
              preset.subdivisionCount,
            )}
            tempo={preset.tempo}
            mx={4}
          />
        </Grid>
      </CardContent>
    </Card>
  );
}
