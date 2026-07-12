import { MetronomeComponent } from "~/view/components";

import { SiteLayout } from "./SiteLayout";
import { KeybindHandler } from "./KeybindHandler";

//================================================

export function Root() {
  return (
    <>
      <KeybindHandler />
      <SiteLayout>
        <MetronomeComponent />
      </SiteLayout>
    </>
  );
}
