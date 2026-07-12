import { useState } from "react";

import { buildPreset } from "~/utils/helpers";
import { useModalTarget } from "~/utils/hooks";
import { useAppState } from "~/view/context";

import { CreateUpdatePresetModal } from "./CreateUpdatePresetModal";

import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import SaveRounded from "@mui/icons-material/SaveRounded";

import type { NewMetronomePreset } from "./CreateUpdatePresetModal";

//================================================

export function SavePresetButton() {
  const { state } = useAppState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, name, ...curState } = buildPreset(state.rhythm, state.tempo, "");

  const [target, setTarget] = useState<NewMetronomePreset>();
  const onClose = () => setTarget(undefined);

  const [open, preset, transitionProps] = useModalTarget(target);

  return (
    <>
      <Tooltip title="Save as preset">
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
      </Tooltip>

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
