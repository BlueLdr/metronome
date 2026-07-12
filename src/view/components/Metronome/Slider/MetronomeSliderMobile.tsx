import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useWindowSize } from "~/utils/hooks";
import { Visualizer } from "~/view/components/Visualizer";
import { TapTempoButton } from "~/view/components/Controls";

import { useMetronomeSlider } from "./useMetronomeSlider";
import { ThemedSlider } from "./ThemedSlider";

import TouchAppRounded from "@mui/icons-material/TouchAppRounded";
import FiberSmartRecordIcon from "@mui/icons-material/FiberSmartRecordRounded";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import type { MetronomeSliderProps } from "./MetronomeSlider";

//================================================

const BottomGapContent = styled("div")`
  position: absolute;
  bottom: 13%;
  left: 50%;
  transform: translate(-50%, calc(50% - 6px));
  z-index: 5;
`;

const CenterContent = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% - 3px));
  z-index: -1;
  & .MuiVisualizerNode-root {
    border-color: transparent !important;
  }
`;

const CenterFrontContent = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% - 3px));
  z-index: 6;
`;

export function MetronomeSliderMobile({
  inputPortalElementRef,
  ...props
}: MetronomeSliderProps & {
  inputPortalElementRef: React.Ref<HTMLDivElement | null>;
}) {
  const sliderProps = useMetronomeSlider(props);

  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isXs = useMediaQuery((theme) => theme.breakpoints.down(400));

  const windowSize = useWindowSize();
  const windowSizePercentXs = windowSize / 600;

  const radius = Math.min(Math.round(windowSize / 2.5), 200);
  const sliderSizeProps: Partial<MetronomeSliderProps> = isSm
    ? {
        pathRadius: radius,
        pathThickness: 2 + Math.round(windowSizePercentXs * 4),
        longerTicksHeight: 16 - (1 - windowSizePercentXs) * 2,
        ticksGroupSize: windowSize > 400 ? 6 : 7,
      }
    : {
        pathRadius: 200,
        pathThickness: 6,
      };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      width="100%"
      sx={{ "--slider-radius": radius }}
    >
      <Box position="relative" width="fit-content">
        <ThemedSlider
          {...sliderProps}
          {...sliderSizeProps}
          mousewheelDisabled
          pointerTouchRadius={30}
        />
        <BottomGapContent>
          <TapTempoButton
            iconOnly
            color="secondary"
            size={isXs ? 16 : 20}
            icon={<TouchAppRounded />}
            activeIcon={<FiberSmartRecordIcon color="error" />}
          />
        </BottomGapContent>

        <CenterContent>
          <Visualizer
            size={radius * 1.1 - (sliderSizeProps.pathThickness ?? 6) / 2}
            beats="combined"
          />
        </CenterContent>
        <CenterFrontContent ref={inputPortalElementRef} />
      </Box>
    </Grid>
  );
}
