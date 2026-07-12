import { NumberField } from "@base-ui/react/number-field";
import { alpha, styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/AddRounded";
import RemoveIcon from "@mui/icons-material/RemoveRounded";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDownRounded";
import { mergeSlotProps } from "@mui/material/utils";

import type { TextFieldProps } from "@mui/material/TextField";
import type { DistributiveOmit } from "~/utils/types";

//================================================

const Button = styled(IconButton)`
  transition-property: opacity, background-color, color, border;
`;

const ArrowButton = styled(Button)`
  padding-top: 0;
  padding-bottom: 0;
  border-radius: 0;
  &:first-child {
    border-top-right-radius: ${({ theme }) => theme.shape.borderRadius};
  }
  &:last-child {
    border-bottom-right-radius: ${({ theme }) => theme.shape.borderRadius};
  }
`;

export type NumberInputProps = NumberField.Root.Props & {
  decrementProps?: NumberField.Decrement.Props;
  incrementProps?: NumberField.Increment.Props;
  disableAutoHideButtons?: boolean;
  inputProps?: DistributiveOmit<
    TextFieldProps,
    | "value"
    | "onChange"
    | "inputRef"
    | "onBlur"
    | "onFocus"
    | "onKeyUp"
    | "onKeyDown"
    | "variant"
    | "slotProps"
  > & {
    slotProps?: {
      [K in keyof Required<TextFieldProps>["slotProps"]]?: Exclude<
        Required<TextFieldProps>["slotProps"][K],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (...args: any[]) => any
      >;
    };
  };

  variant?: TextFieldProps["variant"] | "ghost";
  buttonPlacement?: "default" | "inputEnd" | "inputSides" | "inputEndArrows";
};

export function NumberInput({
  incrementProps,
  decrementProps,
  inputProps: inputComponentProps,
  buttonPlacement = "default",
  disableAutoHideButtons: disableAutoHideButtonsProp,
  variant = "ghost",
  ...props
}: NumberInputProps) {
  const isTouchDevice = useMediaQuery("(pointer: coarse)");
  const disableAutoHideButtons = disableAutoHideButtonsProp ?? isTouchDevice;

  const ButtonComponent =
    buttonPlacement === "inputEndArrows" ? ArrowButton : Button;

  const incrementButton = (
    <NumberField.Increment
      render={<ButtonComponent size="small" />}
      {...incrementProps}
    >
      {incrementProps?.children ||
        (buttonPlacement === "inputEndArrows" ? (
          <KeyboardArrowUp
            fontSize={inputComponentProps?.size}
            sx={{ transform: "translateY(2px)" }}
          />
        ) : (
          <AddIcon />
        ))}
    </NumberField.Increment>
  );
  const decrementButton = (
    <NumberField.Decrement
      render={<ButtonComponent size="small" />}
      {...decrementProps}
    >
      {decrementProps?.children ||
        (buttonPlacement === "inputEndArrows" ? (
          <KeyboardArrowDown
            fontSize={inputComponentProps?.size}
            sx={{ transform: "translateY(-2px)" }}
          />
        ) : (
          <RemoveIcon />
        ))}
    </NumberField.Decrement>
  );

  const { startAdornment, endAdornment, ...inputSlotProps } =
    inputComponentProps?.slotProps?.input ?? {};

  return (
    <NumberField.Root
      {...props}
      onKeyDown={(e) => {
        props.onKeyDown?.(e);
        if (!e.defaultPrevented && e.key === "Escape") {
          (e.target as HTMLElement).blur();
        }
      }}
    >
      <Grid
        container
        alignItems="center"
        wrap="nowrap"
        sx={
          disableAutoHideButtons
            ? undefined
            : {
                "&:not(:has(:focus,:hover,.Mui-focused)) .MuiIconButton-root:not(:hover):not(:focus)":
                  {
                    opacity: 0,
                  },
              }
        }
      >
        {buttonPlacement === "default" && decrementButton}
        <NumberField.Input
          render={(
            {
              ref,
              onBlur,
              onChange,
              onKeyUp,
              onKeyDown,
              onFocus,
              ...inputProps
            },
            state,
          ) => (
            <TextField
              variant={variant === "ghost" ? "filled" : variant}
              {...inputComponentProps}
              inputRef={ref}
              value={state.inputValue}
              onBlur={onBlur}
              onChange={onChange}
              onKeyUp={onKeyUp}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              hiddenLabel={!inputComponentProps?.label}
              slotProps={{
                htmlInput: mergeSlotProps(
                  inputComponentProps?.slotProps?.htmlInput,
                  {
                    ...inputProps,
                    sx: {
                      fontFamily: "var(--font-number-input)",
                      fontVariationSettings: `"wght" 450, "GRAD" 72, "wdth" 105`,
                      letterSpacing: "4px",
                      flexShrink: 1,

                      textAlign:
                        buttonPlacement === "inputSides" ? "center" : undefined,
                    },
                  },
                ),
                input: mergeSlotProps(inputSlotProps, {
                  sx: {
                    ...(variant === "ghost"
                      ? {
                          pr: buttonPlacement === "inputSides" ? undefined : 0,
                          flexGrow: 1,
                          borderRadius: (theme) => theme.spacing(1.5),
                          "&::before, &::after": { display: "none" },
                          "&:not(:hover):not(.Mui-focused):not(:has(input.Mui-focused,input:focus))":
                            {
                              backgroundColor: (theme) =>
                                alpha(theme.palette.divider, 0),
                            },
                        }
                      : undefined),
                    ...(buttonPlacement === "inputSides"
                      ? {
                          justifyContent: "center",
                        }
                      : undefined),
                  },
                  startAdornment:
                    buttonPlacement === "inputSides" ? (
                      <InputAdornment position="start">
                        {decrementButton}
                        {startAdornment}
                      </InputAdornment>
                    ) : undefined,
                  endAdornment: buttonPlacement.startsWith("inputEnd") ? (
                    <InputAdornment
                      position="end"
                      sx={{
                        alignItems: "center",
                        minWidth: 0,
                        flexShrink: 0,
                      }}
                    >
                      {endAdornment}
                      <Grid
                        container
                        sx={{
                          marginTop: inputComponentProps?.label
                            ? (theme) => theme.spacing(4)
                            : undefined,
                          ...(buttonPlacement === "inputEndArrows"
                            ? {
                                flexDirection: "column",
                                alignItems: "flex-end",
                                marginRight: (theme) => theme.spacing(3),
                              }
                            : {
                                flexDirection: "row-reverse",
                                flexWrap: "nowrap",
                                flex: "1 1 auto",
                                marginRight: (theme) => theme.spacing(2),
                              }),
                        }}
                      >
                        {incrementButton}
                        {decrementButton}
                      </Grid>
                    </InputAdornment>
                  ) : buttonPlacement === "inputSides" ? (
                    <InputAdornment
                      position="end"
                      sx={inputComponentProps?.label ? { mt: 4 } : {}}
                    >
                      {incrementButton}
                    </InputAdornment>
                  ) : undefined,
                }),
              }}
            />
          )}
        />
        {buttonPlacement === "default" && incrementButton}
      </Grid>
    </NumberField.Root>
  );
}
