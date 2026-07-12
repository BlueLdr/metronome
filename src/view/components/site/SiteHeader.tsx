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
      <Grid
        container
        gap={4}
        sx={(theme) => ({
          [theme.breakpoints.down("xs")]: {
            justifyContent: "space-between",
          },
        })}
      >
        <SiteSidebarButton disabled={sidebarOpen} />
        <SiteLogo />
        <Grid
          sx={(theme) => ({
            width: theme.spacing(10),
            display: "none",
            [theme.breakpoints.down("xs")]: {
              display: "block",
            },
          })}
        />
      </Grid>
    </AppBar>
  );
}
