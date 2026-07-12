import { useAppState } from "~/view/context";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MenuOpenRounded from "@mui/icons-material/MenuOpenRounded";
import MenuRounded from "@mui/icons-material/MenuRounded";

import type { IconButtonProps } from "@mui/material/IconButton";

//================================================

export function SiteSidebarButton(props: IconButtonProps) {
  const { state, setSidebarOpen } = useAppState();
  const sidebarOpen = state.data.state.sidebarOpen;
  return (
    <Tooltip title={`${sidebarOpen ? "Close" : "Open"} sidebar`}>
      <IconButton {...props} onClick={() => setSidebarOpen((value) => !value)}>
        {sidebarOpen ? <MenuOpenRounded /> : <MenuRounded />}
      </IconButton>
    </Tooltip>
  );
}
