import { PresetListItem } from "./PresetListItem";

import List from "@mui/material/List";

import type { ListProps } from "@mui/material/List";
import type { MetronomePreset } from "~/utils/types";
import type { PresetListItemProps } from "./PresetListItem";

//================================================

export type PresetListProps = ListProps &
  Pick<PresetListItemProps, "onClickEdit" | "onClickDelete" | "onClickLoad"> & {
    presets: MetronomePreset[];
  };

export function PresetList({
  presets,
  onClickDelete,
  onClickLoad,
  onClickEdit,
  ...props
}: PresetListProps) {
  return (
    <List {...props}>
      {presets.map((preset) => (
        <PresetListItem
          key={preset.id}
          preset={preset}
          {...{ onClickDelete, onClickLoad, onClickEdit }}
        />
      ))}
    </List>
  );
}
