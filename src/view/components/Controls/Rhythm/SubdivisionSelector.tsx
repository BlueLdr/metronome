import { NumberInput } from "~/view/components/common";

import { mergeSlotProps } from "@mui/material/utils";

import type { NumberInputProps } from "~/view/components/common";

//================================================

export type SubdivisionSelectorProps = NumberInputProps;

export function SubdivisionSelector(props: SubdivisionSelectorProps) {
  return (
    <NumberInput
      buttonPlacement="inputEnd"
      disableAutoHideButtons
      {...props}
      min={1}
      max={8}
      step={1}
      smallStep={1}
      largeStep={1}
      inputProps={{
        label: "Subdivision (notes per beat)",
        ...props.inputProps,
        sx: {
          justifyContent: "center",
          justifySelf: "flex-end",
          ...props.inputProps?.sx,
        },
        slotProps: {
          ...props.inputProps?.slotProps,
          htmlInput: mergeSlotProps(props.inputProps?.slotProps?.htmlInput, {
            sx: {
              fontSize: (theme) => theme.typography.h3.fontSize,
              minWidth: "2.75rem",
            },
          }),
        },
      }}
    />
  );
}
