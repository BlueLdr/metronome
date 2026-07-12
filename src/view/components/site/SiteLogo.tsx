import { styled } from "@mui/material/styles";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import type { GridProps } from "@mui/material/Grid";

//================================================

const StyledImage = styled("img")`
  width: ${({ theme }) => theme.spacing(6)};
  height: ${({ theme }) => theme.spacing(6)};
  object-fit: contain;
  object-position: center;
`;

export function SiteLogo(props: GridProps) {
  return (
    <Grid container gap={2} alignItems="center" {...props}>
      <StyledImage src="/favicon.svg" alt="Site logo metronome icon" />
      <Typography
        variant="h4"
        fontSize="1.5rem"
        fontFamily="var(--font-logo)"
        sx={(theme) => ({
          [theme.breakpoints.down("xs")]: {
            display: "none",
          },
        })}
      >
        Blue Metronome
      </Typography>
    </Grid>
  );
}
