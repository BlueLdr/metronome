import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import InputRounded from "@mui/icons-material/InputRounded";

import type { ListItemProps } from "@mui/material/ListItem";
import type { MetronomePreset } from "~/utils/types";

//================================================

export type PresetListItemProps = ListItemProps & {
  preset: MetronomePreset;
  onClickEdit?: (preset: MetronomePreset) => void;
  onClickDelete?: (preset: MetronomePreset) => void;
  onClickLoad?: (preset: MetronomePreset) => void;
};

export function PresetListItem({
  preset,
  onClickLoad,
  onClickEdit,
  onClickDelete,
  ...props
}: PresetListItemProps) {
  return (
    <ListItem
      {...props}
      disablePadding
      secondaryAction={
        (onClickEdit || onClickDelete) && (
          <>
            {onClickEdit && (
              <Tooltip title="Edit preset">
                <IconButton onClick={() => onClickEdit(preset)}>
                  <EditRounded />
                </IconButton>
              </Tooltip>
            )}
            {onClickDelete && (
              <Tooltip title="Delete preset">
                <IconButton onClick={() => onClickDelete(preset)}>
                  <DeleteRounded />
                </IconButton>
              </Tooltip>
            )}
          </>
        )
      }
    >
      <ListItemButton
        onClick={() => onClickLoad?.(preset)}
        sx={
          onClickEdit && onClickDelete
            ? {
                ".MuiListItem-root > &": {
                  paddingRight: (theme) => theme.spacing(20),
                },
              }
            : undefined
        }
      >
        <ListItemText>{preset.name}</ListItemText>
        {onClickLoad && (
          <Tooltip title="Load preset">
            <Box
              px={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <InputRounded />
            </Box>
          </Tooltip>
        )}
      </ListItemButton>
    </ListItem>
  );
}
