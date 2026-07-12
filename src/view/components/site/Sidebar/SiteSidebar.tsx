import useMediaQuery from "@mui/material/useMediaQuery";

import { useAppState } from "~/view/context";
import { SettingsModal } from "~/view/components/Settings";

import { SiteLogo } from "../SiteLogo";
import { SiteSidebarButton } from "./SiteSidebarButton";
import { SiteSidebarPresetList } from "./SiteSidebarPresetList";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SettingsRounded from "@mui/icons-material/SettingsRounded";

import type { DrawerProps } from "@mui/material/Drawer";

//================================================

export function SiteSidebar(props: DrawerProps) {
  const { state, setSidebarOpen } = useAppState();
  const sidebarOpen = state.data.state.sidebarOpen;

  const isLg = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Drawer
      {...props}
      sx={{
        ...props.sx,
        maxHeight: "100vh",
        maxWidth: "100vw",
      }}
      variant={isLg ? "persistent" : "temporary"}
      anchor="left"
      open={sidebarOpen}
      // onOpen={() => setSidebarOpen(true)}
      onClose={() => setSidebarOpen(false)}
    >
      <AppBar position="static">
        <Grid container justifyContent="space-between" alignItems="center">
          <SiteLogo ml={4} />
          <SiteSidebarButton disabled={!sidebarOpen} />
        </Grid>
      </AppBar>

      <SiteSidebarPresetList
        sx={{ flexGrow: 1, marginBottom: (theme) => theme.spacing(6) }}
      />
      {isSm && (
        <>
          <Box flexGrow={1} />
          <List sx={{ justifySelf: "flex-end" }}>
            <SettingsModal
              trigger={
                <ListItemButton>
                  <ListItemIcon>
                    <SettingsRounded fontSize="large" />
                  </ListItemIcon>
                  <ListItemText slotProps={{ primary: { fontSize: 18 } }}>
                    Settings
                  </ListItemText>
                </ListItemButton>
              }
            />
          </List>
        </>
      )}
    </Drawer>
  );
}
