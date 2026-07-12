import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { cloneElement, useEffect, useRef, useState } from "react";

import { SettingsTab } from "~/utils/constants";
import { Modal } from "~/view/components/common";

import { SettingsNav } from "./SettingsNav";
import { SettingsSoundTab } from "./Sound";
import { SettingsAttributionTab } from "./Attribution";

import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import Slide from "@mui/material/Slide";
import Tooltip from "@mui/material/Tooltip";
import SettingsRounded from "@mui/icons-material/SettingsRounded";

import type { ButtonProps } from "@mui/material/Button";

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
    ${({ theme }) => theme.breakpoints.down("sm")} {
      display: block;
    }
  }
`;

const Content = styled(Grid)`
  // gap: ${({ theme }) => theme.spacing(4)};
  ${({ theme }) => theme.breakpoints.up("md")} {
    min-width: ${({ theme }) => theme.spacing(120)};
    width: min(
      ${({ theme }) => theme.spacing(160)},
      calc(100vw - ${({ theme }) => theme.spacing(18 + 40)})
    );
    height: ${({ theme }) => theme.spacing(160)};
    max-height: calc(100vh - ${({ theme }) => theme.spacing(18.25 + 20)});
  }
  ${({ theme }) => theme.breakpoints.down("md")} {
    width: calc(100vw - ${({ theme }) => theme.spacing(40.25)});
    max-height: calc(100vh - ${({ theme }) => theme.spacing(18.25)});
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    max-height: calc(100vh - ${({ theme }) => theme.spacing(30.5)});
    width: 100%;
  }
  padding: ${({ theme }) => theme.spacing(4, 6)};
  overflow-y: auto;
`;

export type SettingsModalProps = { trigger?: React.ReactElement<ButtonProps> };

export function SettingsModal({ trigger }: SettingsModalProps) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
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

  const button = trigger ? (
    cloneElement(trigger, {
      onClick: (e) => {
        setOpen(true);
        trigger.props.onClick?.(e);
      },
    })
  ) : (
    <Fab onClick={() => setOpen(true)}>
      <SettingsRounded />
    </Fab>
  );

  return (
    <>
      <Tooltip title="Settings">{button}</Tooltip>
      <StyledModal
        id="settings"
        open={open}
        onClose={() => setOpen(false)}
        disableRestoreFocus
        titleText="Settings"
        fullScreen={isMobile}
        {...(isMobile
          ? {
              slots: {
                transition: Slide,
              },
              slotProps: {
                transition: {
                  direction: "up",
                },
              },
            }
          : undefined)}
      >
        <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
        <Content ref={contentRef}>{content[activeTab]}</Content>
      </StyledModal>
    </>
  );
}
