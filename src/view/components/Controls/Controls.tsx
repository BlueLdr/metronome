import { useAppState } from "~/view/context";

import { SubdivisionVisualizer, Visualizer } from "../Visualizer";
import { SubdivisionSelector } from "./Rhythm/SubdivisionSelector";

import Grid from "@mui/material/Grid";

//================================================

export function Controls() {
  const { setSubdivisions, state } = useAppState();
  const subdivisions =
    state.rhythm.notes.length / state.rhythm.timeSignature.count;

  return (
    <Grid
      container
      direction="column"
      gap={8}
      gridArea="bottom"
      alignSelf="flex-start"
      gridColumn="span 3"
      alignItems="center"
    >
      <Visualizer size="large" subdivisions="combined" />
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
              transform: "translateY(25%)",
            }}
          >
            <SubdivisionVisualizer
              timeSignatureDivision={state.rhythm.timeSignature.division}
              value={subdivisions}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
