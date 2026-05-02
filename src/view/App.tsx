import { ThemeProvider } from "~/theme";

import { MetronomeComponent } from "./components";
import { AppContextProvider } from "./context";

//================================================

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
