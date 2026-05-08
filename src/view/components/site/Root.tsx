import { MetronomeComponent } from "~/view/components";

import { KeybindHandler } from "./KeybindHandler";

//================================================

export function Root() {
  return (
    <>
      <KeybindHandler />
      <MetronomeComponent />
    </>
  );
}
