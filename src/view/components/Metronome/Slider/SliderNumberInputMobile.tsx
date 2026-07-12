import { NumberField } from "@base-ui/react/number-field";
import { alpha } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { MAX_BPM, MIN_BPM } from "~/utils/constants";
import { getBpmJumpInterval, mergeSxProps } from "~/utils/helpers";
import { StartStopButton } from "~/view/components/Controls";
import { useAppState } from "~/view/context";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import FilledInput from "@mui/material/FilledInput";
import Grid from "@mui/material/Grid";
import Portal from "@mui/material/Portal";
import Tooltip from "@mui/material/Tooltip";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRounded from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardDoubleArrowDownRounded from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import KeyboardDoubleArrowUpRounded from "@mui/icons-material/KeyboardDoubleArrowUpRounded";

import type { ButtonProps } from "@mui/material/Button";

//================================================

const StepButton = ({
  tooltip,
  ...props
}: ButtonProps & { tooltip: string }) => (
  <Tooltip title={tooltip}>
    <Button
      {...props}
      sx={mergeSxProps({ touchAction: "manipulation", flexGrow: 1 }, props.sx)}
    />
  </Tooltip>
);

export type SliderNumberInputMobileProps = {
  inputPortalElement: HTMLElement | null;
};

export function SliderNumberInputMobile({
  inputPortalElement,
}: SliderNumberInputMobileProps) {
  const { setBpm: onChange, state } = useAppState();
  const value = state.tempo.bpm;

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("xs"));

  const onClickLargeStep = (direction: 1 | -1) => {
    onChange(
      (prevValue) =>
        prevValue + getBpmJumpInterval(prevValue, direction) * direction,
    );
    // ref.current?.focus({ preventScroll: true });
  };

  return (
    <Box
      position="sticky"
      bottom={0}
      pb={6}
      pt={4}
      zIndex={(theme) => theme.zIndex.fab}
    >
      <Grid
        margin="auto"
        container
        alignItems="center"
        p={0}
        sx={{
          filter:
            "drop-shadow(0px 2px 4px rgba(0,0,0,0.2)) drop-shadow(0px 4px 5px rgba(0,0,0,0.14))",
          width: "100%",
          maxWidth: (theme) =>
            `min(${theme.spacing(108)}, calc(100% - ${theme.spacing(8)}))`,
          backgroundColor: "#181818",
        }}
      >
        <ButtonGroup
          component={NumberField.Root}
          variant="outlined"
          size="small"
          sx={{
            width: "100%",
          }}
          value={value}
          smallStep={1}
          largeStep={value < 120 ? 2 : 4}
          onInput={(e) => {
            const newValue = Number((e.target as HTMLInputElement).value);
            if (!isNaN(newValue)) {
              onChange(Math.max(MIN_BPM, Math.min(MAX_BPM, newValue)));
            }
          }}
          onValueChange={(newValue) => {
            if (newValue != null) {
              onChange(Math.max(MIN_BPM, Math.min(MAX_BPM, newValue)));
            }
          }}
          onKeyDown={(e) => {
            if (!e.defaultPrevented && e.key === "Escape") {
              (e.target as HTMLElement).blur();
            }
          }}
          min={MIN_BPM}
          max={MAX_BPM}
        >
          <StepButton
            tooltip="Decrease BPM more"
            onClick={() => onClickLargeStep(-1)}
          >
            <KeyboardDoubleArrowDownRounded
              fontSize={isXs ? "medium" : "large"}
            />
          </StepButton>
          <NumberField.Decrement
            render={
              <StepButton
                tooltip="Decrease BPM"
                sx={{ paddingRight: (theme) => theme.spacing(5) }}
              />
            }
          >
            <KeyboardArrowDownRounded fontSize={isXs ? "medium" : "large"} />
          </NumberField.Decrement>
          <NumberField.Input
            render={(inputProps, state) => (
              <>
                <Portal container={inputPortalElement}>
                  <FilledInput
                    inputRef={inputProps.ref}
                    value={state.inputValue}
                    onBlur={inputProps.onBlur}
                    onChange={inputProps.onChange}
                    onKeyUp={inputProps.onKeyUp}
                    onKeyDown={inputProps.onKeyDown}
                    onFocus={inputProps.onFocus}
                    slotProps={{
                      input: {
                        ...inputProps,
                        sx: {
                          textAlign: "center",
                          fontFamily: "var(--font-number-input)",
                          fontVariationSettings: `"wght" 450, "GRAD" 72, "wdth" 105`,
                          letterSpacing: "4px",
                          fontSize: `calc(${92 / 200} * var(--slider-radius) * 1px)`,
                          width: `calc(${38 / 200} * var(--slider-radius) * var(--mui-spacing))`,
                          padding: (theme) => theme.spacing(2),
                        },
                      },
                    }}
                    sx={{
                      px: 0,
                      borderRadius: (theme) => theme.spacing(1.5),
                      "&::before, &::after": { display: "none" },
                      "&:not(:hover):not(.Mui-focused):not(:has(input.Mui-focused,input:focus))":
                        {
                          backgroundColor: (theme) =>
                            alpha(theme.palette.divider, 0),
                        },
                    }}
                  />
                </Portal>
                <Box
                  sx={(theme) => ({
                    position: "relative",
                    width: theme.spacing(10),
                    height: theme.spacing(14),
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                    [theme.breakpoints.down(400)]: {
                      width: theme.spacing(8),
                    },
                  })}
                >
                  <StartStopButton
                    sx={(theme) => ({
                      width: theme.spacing(20),
                      height: theme.spacing(20),
                      position: "absolute",
                      zIndex: 2,
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      [theme.breakpoints.down(400)]: {
                        width: theme.spacing(16),
                        height: theme.spacing(16),
                      },
                    })}
                    iconSx={(theme) => ({
                      fontSize: theme.typography.h2.fontSize,

                      [theme.breakpoints.down(400)]: {
                        fontSize: theme.typography.h3.fontSize,
                      },
                    })}
                  />
                </Box>
              </>
            )}
          />
          <NumberField.Increment
            render={
              <StepButton
                tooltip="Increase BPM"
                sx={{ paddingLeft: (theme) => theme.spacing(5) }}
              />
            }
          >
            <KeyboardArrowUpRounded fontSize={isXs ? "medium" : "large"} />
          </NumberField.Increment>
          <StepButton
            tooltip="Increase BPM more"
            onClick={() => onClickLargeStep(1)}
          >
            <KeyboardDoubleArrowUpRounded
              fontSize={isXs ? "medium" : "large"}
            />
          </StepButton>
        </ButtonGroup>
      </Grid>
    </Box>
  );
}
