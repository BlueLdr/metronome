import { NumberField } from "@base-ui/react/number-field";
import { alpha, styled } from "@mui/material/styles";

import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import FilledInput from "@mui/material/FilledInput";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

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
        <NumberField.Decrement render={<Button size="small" />}>
          <RemoveIcon fontSize="large" />
        </NumberField.Decrement>
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
                    fontFamily: "var(--font-main-bpm)",
                    fontVariationSettings: `"wght" 450, "GRAD" 72, "wdth" 105`,
                    letterSpacing: "4px",
                    fontSize: 92,
                    width: (theme) => theme.spacing(38),
                    padding: (theme) => theme.spacing(2),
                  },
                },
              }}
              sx={{
                pr: 0,
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
        <NumberField.Increment render={<Button size="small" />}>
          <AddIcon fontSize="large" />
        </NumberField.Increment>
      </Grid>
    </NumberField.Root>
  );
}
