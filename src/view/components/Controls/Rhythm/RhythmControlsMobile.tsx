import useMediaQuery from "@mui/material/useMediaQuery";

import { useAppState } from "~/view/context";

import { SubdivisionVisualizer } from "../../Visualizer";
import { SubdivisionSelector } from "./SubdivisionSelector";
import { TimeSignatureControl } from "./TimeSignature";
import { MasterVolumeSlider } from "../MasterVolumeSlider";

import Grid from "@mui/material/Grid";

//================================================

export function RhythmControlsMobile() {
  const isXs = useMediaQuery((theme) => theme.breakpoints.between(400, "sm"));
  const { setSubdivisions, setTimeSignature, state } = useAppState();
  const subdivisions =
    state.rhythm.notes.length / state.rhythm.timeSignature.count;

  return (
    <Grid
      container
      direction="column"
      gap={4}
      gridArea="bottom"
      alignSelf="flex-start"
      alignItems="center"
      justifyContent="center"
      width="100%"
      px={6}
    >
      <MasterVolumeSlider
        containerProps={{
          sx: {
            flexGrow: 1,
            width: "100%",
            maxWidth: (theme) => theme.spacing(108),
          },
        }}
      />
      <Grid
        container
        display="grid"
        gridTemplateColumns={"1fr 1fr"}
        alignItems="center"
        gap={2}
        sx={(theme) => ({
          [theme.breakpoints.down(400)]: {
            display: "flex",
            direction: "column",
            width: "100%",
            justifyContent: "center",
          },
        })}
      >
        <TimeSignatureControl
          value={state.rhythm.timeSignature}
          onChange={setTimeSignature}
          buttonPlacement="inputSides"
          fontSize={isXs ? 56 : 72}
        />
        <Grid container direction="column" alignItems="center">
          <Grid width="fit-content">
            <SubdivisionSelector
              buttonPlacement="inputSides"
              onValueChange={(value) =>
                value == null ? undefined : setSubdivisions(value)
              }
              value={subdivisions}
              inputProps={{
                sx: (theme) => ({
                  [theme.breakpoints.between(400, "sm")]: {
                    maxWidth: theme.spacing(48),
                  },
                  [theme.breakpoints.down(400)]: {
                    maxWidth: theme.spacing(53),
                  },
                  [theme.breakpoints.down("md")]: {
                    maxWidth: theme.spacing(52),
                  },
                }),
                slotProps: {
                  htmlInput: {
                    sx: (theme) => ({
                      [theme.breakpoints.between(400, "sm")]: {
                        height: `${theme.typography.h4.lineHeight}em`,
                        fontSize: theme.typography.h4.fontSize,
                        paddingBottom: theme.spacing(1),
                      },
                    }),
                  },
                },
              }}
            />
          </Grid>
          <Grid
            sx={{
              maxWidth: (theme) => `min(${theme.spacing(70)}, 100%)`,
              height: (theme) => theme.spacing(20),
              transform: "translateY(15%)",
              overflowX: "clip",
            }}
          >
            <SubdivisionVisualizer
              timeSignatureDivision={state.rhythm.timeSignature.division}
              value={subdivisions}
              sx={{
                fontSize: (theme) => theme.typography.h4.fontSize,
                marginBottom: (theme) => theme.spacing(-2),
              }}
              alignSelf="flex-start"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
