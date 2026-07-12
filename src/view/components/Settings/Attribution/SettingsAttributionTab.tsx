import baseSounds from "~/utils/constants/sounds/base-sounds.json";

import { SettingsAttributionItem } from "./SettingsAttributionItem";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

//================================================

export function SettingsAttributionTab() {
  return (
    <Grid container direction="column" gap={4}>
      <Typography variant="subtitle1">
        Attribution for all stock non-MIDI sound effects used in this
        application
      </Typography>
      {baseSounds.map((sound) => (
        <SettingsAttributionItem sound={sound} key={sound.name} />
      ))}
    </Grid>
  );
}
