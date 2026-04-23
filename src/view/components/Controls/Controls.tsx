import { MasterVolumeSlider } from "./MasterVolumeSlider";
import { StartStopButton } from "./StartStopButton";
import { TapTempoButton } from "./TapTempoButton";

import Grid from "@mui/material/Grid";
import TouchAppRounded from "@mui/icons-material/TouchAppRounded";

//================================================

export function Controls() {
  return (
    <Grid container direction="column" gap={4}>
      <StartStopButton />
      <TapTempoButton
        color="secondary"
        startIcon={<TouchAppRounded />}
        sx={{
          minWidth: (theme) => theme.spacing(44),
        }}
      />
      <MasterVolumeSlider />
    </Grid>
  );
}
