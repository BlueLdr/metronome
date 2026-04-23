import { ThemeProvider } from "~/theme";

import { MetronomeComponent } from "./components";
import { AppContextProvider } from "./context";

//================================================

/**
 * Title:
 *
 * Istok+Web
 *
 *
 * Body:
 *
 * Assistant
 * Gothic+A1
 * Istok+Web
 */

function App() {
  return (
    <ThemeProvider>
      <AppContextProvider>
        <MetronomeComponent />
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
