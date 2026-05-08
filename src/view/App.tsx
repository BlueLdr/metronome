import { ThemeProvider } from "~/theme";
import { Root } from "~/view/components/site";

import { AppContextProvider, TapTempoProvider } from "./context";

//================================================

function App() {
  return (
    <ThemeProvider>
      <AppContextProvider>
        <TapTempoProvider>
          <Root />
        </TapTempoProvider>
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
