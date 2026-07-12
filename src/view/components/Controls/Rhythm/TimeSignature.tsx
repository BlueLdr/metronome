import { NOTE_DIVISIONS } from "~/utils/constants/smufl";
import { NumberInput } from "~/view/components/common";

import Grid from "@mui/material/Grid";

import type { NumberFieldRootProps } from "@base-ui/react/number-field";
import type { NumberInputProps } from "~/view/components/common";
import type { NoteDivision } from "~/utils/types";
import type { TimeSignature } from "~/model";

//================================================

const TIME_SIGNATURE_DIVISIONS = NOTE_DIVISIONS.filter((n) => n <= 32).sort(
  (a, b) => (a > b ? 1 : -1),
);

type TimeSignatureNumberInputStyleProps = Pick<
  NumberInputProps,
  "buttonPlacement"
> & { fontSize?: string | number };
type TimeSignatureNumberInputProps = NumberFieldRootProps &
  TimeSignatureNumberInputStyleProps;

function TimeSignatureNumberInput({
  fontSize = 64,
  ...props
}: TimeSignatureNumberInputProps) {
  return (
    <NumberInput
      {...props}
      inputProps={{
        slotProps: {
          htmlInput: {
            sx: {
              fontFamily: "Bravura Numbers",
              fontSize,
              textAlign: "center",
              height: "0.8em",
              padding: (theme) => theme.spacing(1),
              width: `calc((84 / 64) * ${typeof fontSize === "number" ? `${fontSize}px` : fontSize})`,
            },
          },
        },
      }}
    />
  );
}

export type TimeSignatureControlProps = {
  value: TimeSignature;
  onChange: (newValue: TimeSignature) => void;
} & TimeSignatureNumberInputStyleProps;

export function TimeSignatureControl({
  value,
  onChange,
  buttonPlacement,
  fontSize,
}: TimeSignatureControlProps) {
  return (
    <Grid container direction="column" alignItems="center">
      <TimeSignatureNumberInput
        min={1}
        max={64}
        value={value.count}
        onValueChange={(newValue) => {
          if (newValue != null) {
            onChange({ ...value, count: newValue });
          }
        }}
        buttonPlacement={buttonPlacement}
        fontSize={fontSize}
      />
      <TimeSignatureNumberInput
        min={1}
        max={TIME_SIGNATURE_DIVISIONS[TIME_SIGNATURE_DIVISIONS.length - 1]}
        value={value.division}
        onValueChange={(newValue) => {
          if (newValue != null) {
            const curIndex = TIME_SIGNATURE_DIVISIONS.indexOf(
              value.division as NoteDivision,
            );
            if (
              newValue > value.division &&
              curIndex < TIME_SIGNATURE_DIVISIONS.length - 1
            ) {
              onChange({
                ...value,
                division: TIME_SIGNATURE_DIVISIONS[curIndex + 1],
              });
            } else if (newValue < value.division && curIndex > 0) {
              onChange({
                ...value,
                division: TIME_SIGNATURE_DIVISIONS[curIndex - 1],
              });
            }
          }
        }}
        buttonPlacement={buttonPlacement}
        fontSize={fontSize}
      />
    </Grid>
  );
}
