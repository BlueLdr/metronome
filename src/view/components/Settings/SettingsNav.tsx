import useMediaQuery from "@mui/material/useMediaQuery";
import { values } from "lodash";

import { SettingsTab } from "~/utils/constants";

import AttributionRounded from "@mui/icons-material/AttributionRounded";
import MusicNoteRounded from "@mui/icons-material/MusicNoteRounded";
// import SettingsRounded from "@mui/icons-material/SettingsRounded";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import type { ValueAndSetter } from "~/utils/types";

//================================================

const LabelMap: Record<
  SettingsTab,
  { icon: React.ReactElement; label: string; sx?: { marginTop?: string } }
> = {
  // [SettingsTab.General]: {
  //   icon: <SettingsRounded />,
  //   label: "General",
  // },
  [SettingsTab.Sound]: {
    icon: <MusicNoteRounded />,
    label: "Sounds",
  },
  [SettingsTab.Attribution]: {
    icon: <AttributionRounded />,
    label: "Attribution",
    sx: {
      marginTop: "auto",
    },
  },
};

export type SettingsNavProps = ValueAndSetter<"activeTab", SettingsTab>;

export function SettingsNav({ activeTab, setActiveTab }: SettingsNavProps) {
  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <Tabs
      {...(isSm
        ? {
            variant: "scrollable",
            scrollButtons: "auto",
            orientation: "horizontal",
          }
        : {
            variant: "fullWidth",
            orientation: "vertical",
          })}
      value={activeTab}
      onChange={(_, newValue) => setActiveTab(newValue)}
      sx={(theme) => ({
        [theme.breakpoints.down("sm")]: {
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        },
        [theme.breakpoints.up("sm")]: {
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          py: (theme) => theme.spacing(4),
          width: (theme) => theme.spacing(40),
        },
      })}
      slotProps={{
        list: {
          sx: {
            height: "100%",
          },
        },
      }}
    >
      {values(SettingsTab).map((value) => (
        <Tab
          key={value}
          value={value}
          icon={LabelMap[value].icon}
          label={LabelMap[value].label}
          sx={(theme) => ({
            py: theme.spacing(2),
            minHeight: theme.spacing(12),
            "& .MuiTab-icon": {
              marginRight: theme.spacing(2),
            },
            [theme.breakpoints.up("sm")]: {
              justifyContent: "flex-start",
              flexGrow: 0,
            },
            ...LabelMap[value].sx,
          })}
          iconPosition="start"
        />
      ))}
    </Tabs>
  );
}
