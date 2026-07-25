import { cloneElement, useState } from "react";

import { buildPreset } from "~/utils/helpers";
import { useModalTarget } from "~/utils/hooks";
import { useAppState } from "~/view/context";

import { CreateUpdatePresetModal } from "./CreateUpdatePresetModal";

import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import SaveRounded from "@mui/icons-material/SaveRounded";

import type { ButtonProps } from "@mui/material/Button";
import type { NewMetronomePreset } from "./CreateUpdatePresetModal";

//================================================

export type SavePresetModalProps = {
  trigger?: React.ReactElement<ButtonProps>;
  triggerTooltip?: string;
};

export function SavePresetModal({
  trigger,
  triggerTooltip = "Save as preset",
}: SavePresetModalProps) {
  const { state } = useAppState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, name, ...curState } = buildPreset(
    state.measures[0],
    state.tempo,
    "",
  );

  const [target, setTarget] = useState<NewMetronomePreset>();
  const onClose = () => setTarget(undefined);

  const [open, preset, transitionProps] = useModalTarget(target);

  const button = trigger ? (
    cloneElement(trigger, {
      onClick: (e) => {
        setTarget(curState);
        trigger.props.onClick?.(e);
      },
    })
  ) : (
    <Button
      variant="outlined"
      color="primary"
      size="large"
      onClick={() => setTarget(curState)}
      sx={{
        borderRadius: (theme) => theme.spacing(999),
        width: (theme) => theme.spacing(14),
        height: (theme) => theme.spacing(14),
        minWidth: 0,
        minHeight: 0,
        maxHeight: "none",
        "& .MuiButton-startIcon": {
          margin: 0,
        },
        "&:not(:hover):not(:active):not(:focus):not(.Mui-focused)": {
          opacity: 0.7,
        },
      }}
    >
      <SaveRounded />
    </Button>
  );

  return (
    <>
      <Tooltip title={triggerTooltip}>{button}</Tooltip>

      {!!preset && (
        <CreateUpdatePresetModal
          preset={preset}
          open={open}
          onClose={onClose}
          slotProps={{
            transition: {
              ...transitionProps,
            },
          }}
        />
      )}
    </>
  );
}
