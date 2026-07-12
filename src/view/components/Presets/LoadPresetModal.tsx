import { Modal } from "~/view/components/common";
import { useAppState } from "~/view/context";

import { PresetSummary } from "./PresetSummary";

import Button from "@mui/material/Button";

import type { MetronomePreset } from "~/utils/types";
import type { ModalProps } from "~/view/components/common";

//================================================

export type LoadPresetModalProps = Omit<
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

export function LoadPresetModal({
  preset,
  onClose,
  ...props
}: LoadPresetModalProps) {
  const { loadPreset } = useAppState();

  return (
    <Modal
      {...props}
      onClose={onClose}
      id="load-preset-modal"
      titleText="Load metronome preset"
      cancelButton={<Button>Cancel</Button>}
      confirmButton={
        <Button
          onClick={() => {
            loadPreset(preset);
            onClose();
          }}
        >
          Load preset
        </Button>
      }
    >
      <PresetSummary preset={preset} />
    </Modal>
  );
}
