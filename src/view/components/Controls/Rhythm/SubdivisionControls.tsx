import { useAppState } from "~/view/context";
import { SubdivisionVisualizer } from "~/view/components/Visualizer";

import { SubdivisionSelector } from "./SubdivisionSelector";

import Grid from "@mui/material/Grid";

//================================================

export function SubdivisionControls() {
  const { setSubdivisions, state } = useAppState();
  const subdivisions =
    state.rhythm.notes.length / state.rhythm.timeSignature.count;

  return (
    <Grid
      container
      gap={8}
      display="grid"
      gridTemplateColumns="minmax(0, 1fr) minmax(0, 1fr)"
      width={(theme) => `min(100%, ${theme.spacing(150)})`}
    >
      <Grid container justifyContent="flex-end">
        <Grid width="fit-content">
          <SubdivisionSelector
            onValueChange={(value) =>
              value == null ? undefined : setSubdivisions(value)
            }
            value={subdivisions}
            inputProps={{
              sx: {
                maxWidth: (theme) => theme.spacing(48),
              },
            }}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Grid
          sx={{
            maxWidth: (theme) => theme.spacing(70),
            transform: "translateY(15%)",
          }}
        >
          <SubdivisionVisualizer
            timeSignatureDivision={state.rhythm.timeSignature.division}
            value={subdivisions}
            sx={{
              fontSize: (theme) => theme.typography.h3.fontSize,
            }}
            alignSelf="flex-start"
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
