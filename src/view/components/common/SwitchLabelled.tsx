import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import type { TypographyProps } from "@mui/material/Typography";
import type { StackProps } from "@mui/material/Stack";
import type { SwitchProps } from "@mui/material/Switch";

//================================================

export type SwitchLabelledProps = SwitchProps & {
  containerProps?: StackProps;
  label: React.ReactNode;
  labelTypographyProps?: TypographyProps;
  labelPosition?: "before" | "after";
};

export function SwitchLabelled({
  containerProps,
  label,
  labelTypographyProps,
  labelPosition = "after",
  ...props
}: SwitchLabelledProps) {
  return (
    <Stack
      component="label"
      gap={4}
      alignItems="center"
      flexDirection="row"
      {...containerProps}
    >
      {labelPosition === "before" && (
        <Typography variant="body1" {...labelTypographyProps}>
          {label}
        </Typography>
      )}
      <Switch {...props} />
      {labelPosition === "after" && (
        <Typography variant="body1" {...labelTypographyProps}>
          {label}
        </Typography>
      )}
    </Stack>
  );
}
