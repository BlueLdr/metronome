import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useAppState } from "~/view/context";

import { SiteLogo } from "../SiteLogo";
import { SiteSidebarButton } from "./SiteSidebarButton";
import { SiteSidebarPresetList } from "./SiteSidebarPresetList";

import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";

import type { DrawerProps } from "@mui/material/Drawer";

//================================================

export function SiteSidebar(props: DrawerProps) {
  const { state, setSidebarOpen } = useAppState();
  const sidebarOpen = state.data.state.sidebarOpen;

  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Drawer
      {...props}
      sx={{
        ...props.sx,
        maxHeight: "100vh",
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

      <Typography p={4} variant="h6">
        Presets
      </Typography>
      <Divider />
      <SiteSidebarPresetList
        sx={{ flexGrow: 1, marginBottom: (theme) => theme.spacing(6) }}
      />
    </Drawer>
  );
}
