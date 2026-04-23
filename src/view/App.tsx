import { MetronomeComponent } from "./components";
import { AppContextProvider } from "./context";

//================================================

function App() {
  return (
    <AppContextProvider>
      <MetronomeComponent />
    </AppContextProvider>
  );
}

export default App;
