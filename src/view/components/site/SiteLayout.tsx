import { styled } from "@mui/material/styles";

import { useAppState } from "~/view/context";

import { SiteHeader } from "./SiteHeader";
import { SiteSidebar } from "./Sidebar";

import Grid from "@mui/material/Grid";

//================================================

const DRAWER_WIDTH = 90;

const Root = styled(Grid, { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  marginLeft: 0,
  [theme.breakpoints.up("lg")]: {
    transition: theme.transitions.create("margin-left", {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  variants: [
    {
      props: ({ open }) => open,
      style: {
        [theme.breakpoints.up("lg")]: {
          transition: theme.transitions.create("margin-left", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: theme.spacing(DRAWER_WIDTH),
        },
      },
    },
  ],
}));

export function SiteLayout({ children }: React.PropsWithChildren) {
  const { state } = useAppState();
  const sidebarOpen = state.data.state.sidebarOpen;

  return (
    <Root
      open={sidebarOpen}
      container
      display="grid"
      sx={(theme) => ({
        paddingTop: theme.spacing(10),
      })}
    >
      <SiteHeader />
      <SiteSidebar
        slotProps={{
          paper: {
            sx: {
              width: (theme) => theme.spacing(DRAWER_WIDTH),
            },
          },
        }}
      />
      {children}
    </Root>
  );
}
