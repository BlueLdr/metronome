import { AttributionRounded } from "@mui/icons-material";
import { values } from "lodash";
import type { SxStyleProps } from "~/theme";

import { SettingsTab } from "~/utils/constants";

import MusicNoteRounded from "@mui/icons-material/MusicNoteRounded";
// import SettingsRounded from "@mui/icons-material/SettingsRounded";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import type { ValueAndSetter } from "~/utils/types";

//================================================

const LabelMap: Record<
  SettingsTab,
  { icon: React.ReactElement; label: string; sx?: SxStyleProps & object }
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
  return (
    <Tabs
      variant="fullWidth"
      orientation="vertical"
      value={activeTab}
      onChange={(_, newValue) => setActiveTab(newValue)}
      sx={{
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        py: (theme) => theme.spacing(4),
        width: (theme) => theme.spacing(40),
      }}
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
          sx={{
            py: (theme) => theme.spacing(2),
            minHeight: (theme) => theme.spacing(12),
            justifyContent: "flex-start",
            "& .MuiTab-icon": {
              marginRight: (theme) => theme.spacing(2),
            },
            flexGrow: 0,
            ...LabelMap[value].sx,
          }}
          iconPosition="start"
        />
      ))}
    </Tabs>
  );
}
