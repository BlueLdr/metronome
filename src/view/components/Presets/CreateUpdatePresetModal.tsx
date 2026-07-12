import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";

import { buildPresetId } from "~/utils/helpers";
import { useAppState } from "~/view/context";
import { Modal } from "~/view/components/common";

import { PresetSummary } from "./PresetSummary";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import type { MetronomePreset, WithOverrides } from "~/utils/types";
import type { ModalProps } from "~/view/components/common";

//================================================

export type NewMetronomePreset = WithOverrides<
  MetronomePreset,
  { id?: undefined; name?: undefined }
>;

export type CreateUpdatePresetModalProps = Omit<
  ModalProps,
  | "titleText"
  | "headerActions"
  | "footerActions"
  | "confirmButton"
  | "cancelButton"
  | "children"
  | "id"
  | "hideCloseButton"
> & {
  preset: MetronomePreset | NewMetronomePreset;
};

export function CreateUpdatePresetModal({
  preset,
  onClose,
  ...props
}: CreateUpdatePresetModalProps) {
  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { savePreset } = useAppState();

  const [presetName, setPresetName] = useState(preset.name ?? "");

  const onSave = (replace?: boolean) => {
    if (!presetName) {
      return;
    }
    const id = buildPresetId(
      preset.timeSignature,
      preset.tempo,
      preset.subdivisionCount,
      presetName,
    );
    savePreset(
      { ...preset, name: presetName, id },
      replace ? preset.id : undefined,
    );
    onClose();
  };

  return (
    <Modal
      {...props}
      onClose={onClose}
      id="create-update-preset-modal"
      titleText="Save metronome preset"
      fullScreen={isSm}
      {...(preset.id
        ? {
            footerActions: [
              <Grid
                key="footer-actions"
                container
                justifyContent="space-between"
              >
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
                <Grid container justifyContent="flex-end" spacing={2}>
                  <Button
                    variant="text"
                    onClick={() => onSave()}
                    disabled={!open || !presetName}
                  >
                    Save new preset
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => onSave(true)}
                    disabled={!open || !presetName}
                  >
                    Save changes
                  </Button>
                </Grid>
              </Grid>,
            ],
          }
        : {
            cancelButton: <Button>Cancel</Button>,
            confirmButton: (
              <Button onClick={() => onSave()} disabled={!open || !presetName}>
                Save new preset
              </Button>
            ),
          })}
    >
      <Grid container direction="column" width="100%" spacing={4}>
        <TextField
          required
          disabled={!open}
          name="name"
          label="Name"
          autoFocus={!presetName}
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          sx={{ marginTop: (theme) => theme.spacing(2) }}
        />
        <PresetSummary preset={preset} hideTitle />
      </Grid>
    </Modal>
  );
}
