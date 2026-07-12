import useMediaQuery from "@mui/material/useMediaQuery";

import {
  MetronomeComponent,
  MetronomeMobileComponent,
} from "~/view/components";

import { SiteLayout } from "./SiteLayout";
import { KeybindHandler } from "./KeybindHandler";

//================================================

export function Root() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  return (
    <>
      <KeybindHandler />
      <SiteLayout>
        {isMobile ? <MetronomeMobileComponent /> : <MetronomeComponent />}
      </SiteLayout>
    </>
  );
}
