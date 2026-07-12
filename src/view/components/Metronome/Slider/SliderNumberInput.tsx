import { NumberField } from "@base-ui/react/number-field";
import { alpha, styled } from "@mui/material/styles";

import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import FilledInput from "@mui/material/FilledInput";
import AddIcon from "@mui/icons-material/AddRounded";
import RemoveIcon from "@mui/icons-material/RemoveRounded";

import type { NumberFieldRootProps } from "@base-ui/react/number-field";

//================================================

const Button = styled(IconButton)`
  transition-property: opacity, background-color, color, border;
`;

export type SliderNumberInputProps = NumberFieldRootProps;

export function SliderNumberInput(props: SliderNumberInputProps) {
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
      <Grid container alignItems="center" wrap="nowrap">
        <NumberField.Input
          render={(inputProps, state) => (
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
                    fontSize: `calc((92 / 200) * var(--slider-radius) * 1px)`,
                    width: `calc(${38 / 200} * var(--slider-radius) * var(--mui-spacing))`,
                    padding: (theme) => theme.spacing(2),
                  },
                },
              }}
              sx={{
                pr: 0,
                order: 2,
                flexGrow: 1,
                borderRadius: (theme) => theme.spacing(1.5),
                "&::before, &::after": { display: "none" },
                "&:not(:hover):not(.Mui-focused):not(:has(input.Mui-focused,input:focus))":
                  {
                    backgroundColor: (theme) => alpha(theme.palette.divider, 0),
                  },
              }}
            />
          )}
        />
        <NumberField.Decrement
          render={
            <Button
              size="small"
              sx={{
                order: 1,
                marginRight: (theme) =>
                  theme.spacing(`((var(--slider-radius) - 200) / 32)`),
              }}
            />
          }
        >
          <RemoveIcon fontSize="large" />
        </NumberField.Decrement>
        <NumberField.Increment
          render={
            <Button
              size="small"
              sx={{
                order: 3,
                marginLeft: (theme) =>
                  theme.spacing(`((var(--slider-radius) - 200) / 32)`),
              }}
            />
          }
        >
          <AddIcon fontSize="large" />
        </NumberField.Increment>
      </Grid>
    </NumberField.Root>
  );
}
