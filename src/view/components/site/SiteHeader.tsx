import { useAppState } from "~/view/context";

import { SiteSidebarButton } from "./Sidebar";
import { SiteLogo } from "./SiteLogo";

import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";

//================================================

export function SiteHeader() {
  const { state } = useAppState();
  const sidebarOpen = state.data.state.sidebarOpen;
  return (
    <AppBar variant="elevation">
      <Grid container gap={4}>
        <SiteSidebarButton disabled={sidebarOpen} />
        <SiteLogo />
      </Grid>
    </AppBar>
  );
}
