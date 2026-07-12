import { useAppState } from "~/view/context";
import { Modal } from "~/view/components/common";

import { PresetSummary } from "./PresetSummary";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import type { MetronomePreset } from "~/utils/types";
import type { ModalProps } from "~/view/components/common";

//================================================

export type DeletePresetModalProps = Omit<
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
  preset: MetronomePreset;
};

export function DeletePresetModal({
  preset,
  onClose,
  ...props
}: DeletePresetModalProps) {
  const { deletePreset } = useAppState();

  return (
    <Modal
      {...props}
      onClose={onClose}
      id="load-preset-modal"
      titleText="Delete metronome preset"
      cancelButton={<Button>Cancel</Button>}
      confirmButton={
        <Button
          color="error"
          onClick={() => {
            deletePreset(preset["id"]);
            onClose();
          }}
        >
          Delete preset
        </Button>
      }
    >
      <Typography variant="subtitle1" mb={4}>
        Are you sure you want to delete this preset? This operation cannot be
        undone.
      </Typography>
      <PresetSummary preset={preset} />
    </Modal>
  );
}
