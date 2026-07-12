import { useState } from "react";

import { useModalTarget } from "~/utils/hooks/dom";
import { useAppState } from "~/view/context";
import {
  CreateUpdatePresetModal,
  LoadPresetModal,
  DeletePresetModal,
  PresetList,
} from "~/view/components/Presets";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { BoxProps } from "@mui/material/Box";
import type { MetronomePreset } from "~/utils/types";

//================================================

const usePresetModalTarget = () => {
  const [target, setTarget] = useState<MetronomePreset>();

  const [open, preset, transitionProps] = useModalTarget(target);

  return [
    preset,
    setTarget,
    {
      open,
      onClose: () => setTarget(undefined),
      slotProps: { transition: transitionProps },
    },
  ] as const;
};

export type SiteSidebarPresetListProps = BoxProps;

export function SiteSidebarPresetList(props: SiteSidebarPresetListProps) {
  const { state } = useAppState();

  const [editPreset, setEditTarget, editModalProps] = usePresetModalTarget();
  const [deletePreset, setDeleteTarget, deleteModalProps] =
    usePresetModalTarget();
  const [loadPreset, setLoadTarget, loadModalProps] = usePresetModalTarget();

  return (
    <Box display="flex" flexDirection="column" {...props}>
      {!state.data.presets?.length && (
        <Box py={8} display="flex" alignItems="center" justifyContent="center">
          <Typography variant="body2" color="textDisabled">
            You have no saved presets.
          </Typography>
        </Box>
      )}
      <PresetList
        presets={state.data.presets}
        onClickEdit={setEditTarget}
        onClickLoad={setLoadTarget}
        onClickDelete={setDeleteTarget}
        sx={{
          flexGrow: 1,
          "& .MuiIconButton-root:not(:hover):not(:active), & .MuiListItemButton-root .MuiSvgIcon-root":
            {
              opacity: 0,
              transition: (theme) =>
                theme.transitions.create(
                  ["color", "background-color", "border-color", "opacity"],
                  {
                    duration: theme.transitions.duration.shorter,
                    easing: theme.transitions.easing.easeInOut,
                  },
                ),
            },

          "&:hover": {
            "& .MuiIconButton-root:not(:hover):not(:active), & .MuiListItemButton-root .MuiSvgIcon-root":
              {
                opacity: 0.1,
              },
          },
          "& .MuiListItem-root": {
            "&:hover, &:focus-within, &:has(.Mui-focusVisible)": {
              "& .MuiIconButton-root:not(:hover):not(:active), & .MuiListItemButton-root .MuiSvgIcon-root":
                {
                  opacity: 0.4,
                },
            },
          },
        }}
      />
      {editPreset && (
        <CreateUpdatePresetModal preset={editPreset} {...editModalProps} />
      )}
      {loadPreset && (
        <LoadPresetModal preset={loadPreset} {...loadModalProps} />
      )}
      {deletePreset && (
        <DeletePresetModal preset={deletePreset} {...deleteModalProps} />
      )}
    </Box>
  );
}
