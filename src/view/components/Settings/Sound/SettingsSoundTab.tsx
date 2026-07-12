import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";

import { DEFAULT_SOUND_SETTINGS, DEFAULT_VOLUME } from "~/utils/constants";
import { useAppState } from "~/view/context";

import { SettingsSoundAdvancedSection } from "./SettingsSoundAdvancedSection";
import { SettingsSoundBasicSection } from "./SettingsSoundBasicSection";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import type { SoundSettings } from "~/utils/types";

//================================================

const isBasicMode = (settings: SoundSettings) =>
  settings.firstBeat.sound ||
  settings.subdivision.sound ||
  !(
    (settings.firstBeat.volume === DEFAULT_SOUND_SETTINGS.firstBeat.volume &&
      settings.subdivision.volume ===
        DEFAULT_SOUND_SETTINGS.subdivision.volume &&
      settings.base.volume === DEFAULT_SOUND_SETTINGS.base.volume) ||
    (settings.firstBeat.volume === DEFAULT_SOUND_SETTINGS.firstBeat.volume &&
      settings.subdivision.volume === DEFAULT_SOUND_SETTINGS.base.volume &&
      settings.base.volume === DEFAULT_SOUND_SETTINGS.base.volume) ||
    (settings.firstBeat.volume === DEFAULT_VOLUME &&
      settings.subdivision.volume ===
        DEFAULT_SOUND_SETTINGS.subdivision.volume &&
      settings.base.volume === DEFAULT_VOLUME) ||
    (settings.firstBeat.volume === DEFAULT_VOLUME &&
      settings.subdivision.volume === DEFAULT_VOLUME &&
      settings.base.volume === DEFAULT_VOLUME)
  );

export function SettingsSoundTab() {
  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { state } = useAppState();
  const [mode, setMode] = useState<"basic" | "advanced">(() =>
    isBasicMode(state.data.settings.sounds) ? "advanced" : "basic",
  );
  return (
    <Card variant="elevation">
      <CardHeader
        title="Click sound"
        slotProps={{
          title: isSm
            ? {
                variant: "h6",
              }
            : undefined,
          action: { sx: { marginRight: 0 } },
        }}
        action={
          <Tabs
            value={mode}
            onChange={(_, newMode) => setMode(newMode)}
            sx={(theme) => ({
              width: "100%",
              // margin: (theme) => theme.spacing(-4, 0, 4),
              "& .MuiTab-root": {
                [theme.breakpoints.up("sm")]: {
                  width: "50%",
                  flex: "1 1 50%",
                  maxWidth: "none",
                },
                [theme.breakpoints.down("sm")]: {
                  minWidth: 0,
                  padding: theme.spacing(2),
                },
              },
            })}
          >
            <Tab value="basic" label="Basic" />
            <Tab value="advanced" label="Advanced" />
          </Tabs>
        }
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: 4,
        }}
      >
        {mode === "advanced" ? (
          <SettingsSoundAdvancedSection />
        ) : (
          <SettingsSoundBasicSection />
        )}
      </CardContent>
    </Card>
  );
}
