import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";

import { SettingsTab } from "~/utils/constants";
import { Modal } from "~/view/components/common";

import { SettingsNav } from "./SettingsNav";
import { SettingsSoundTab } from "./Sound";
import { SettingsAttributionTab } from "./Attribution";

import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import SettingsRounded from "@mui/icons-material/SettingsRounded";

//================================================

const StyledModal = styled(Modal)`
  & .MuiDialogTitle-root {
    margin-bottom: 0;
  }
  & .MuiDialogContent-root {
    padding: 0;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    overflow-y: initial;
  }
`;

const Content = styled(Grid)`
  // gap: ${({ theme }) => theme.spacing(4)};
  min-width: ${({ theme }) => theme.spacing(120)};
  width: min(
    ${({ theme }) => theme.spacing(160)},
    calc(100vw - ${({ theme }) => theme.spacing(18 + 40)})
  );
  height: ${({ theme }) => theme.spacing(160)};
  max-height: calc(100vh - ${({ theme }) => theme.spacing(18.25 + 20)});
  padding: ${({ theme }) => theme.spacing(4, 6)};
  overflow-y: auto;
`;

export function SettingsModal() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(SettingsTab.Sound);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.scroll(0, 0);
  }, [activeTab]);

  const content = {
    // [SettingsTab.General]: null,
    [SettingsTab.Sound]: <SettingsSoundTab />,
    [SettingsTab.Attribution]: <SettingsAttributionTab />,
  } satisfies Record<SettingsTab, React.ReactNode>;

  return (
    <>
      <Tooltip title="Settings">
        <Fab onClick={() => setOpen(true)}>
          <SettingsRounded />
        </Fab>
      </Tooltip>
      <StyledModal
        id="settings"
        open={open}
        onClose={() => setOpen(false)}
        disableRestoreFocus
        titleText="Settings"
      >
        <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
        <Content ref={contentRef}>{content[activeTab]}</Content>
      </StyledModal>
    </>
  );
}
