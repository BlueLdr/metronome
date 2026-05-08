import { useMemo, useState } from "react";

import { TapTempoContext } from "./context";

//================================================

export type TapTempoProviderProps = React.PropsWithChildren;

export function TapTempoProvider({ children }: TapTempoProviderProps) {
  const [button, setButton] = useState<HTMLButtonElement | null>(null);

  const value = useMemo(() => ({ button, setButton }), [button]);

  return <TapTempoContext value={value}>{children}</TapTempoContext>;
}
