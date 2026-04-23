import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import { MuiTheme } from "./Theme";

import GlobalStyles from "@mui/material/GlobalStyles";

//================================================

// import { Theme } from "./Theme";

const useGlobalStyles = (
  <GlobalStyles
    styles={{
      html: {
        height: "100%",
        fontOpticalSizing: "auto",
        "--font-default": "Gothic A1",
        "--font-title": "Istok Web",
        "--font-button": "Spline Sans Mono",
      },
      body: {
        margin: 0,
        height: "100%",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      "#root": {
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        minHeight: "100vh",
      },
    }}
  />
);

/*
  This is a higher order component, that will wrap another component
  and expose the MUI Theme object.

  Example:
    const AppWithTheme = withThemeProvider(App);
    export default AppWithTheme
*/
export function ThemeProvider({ children }: React.PropsWithChildren) {
  return (
    <MuiThemeProvider theme={MuiTheme}>
      {useGlobalStyles}
      {children}
    </MuiThemeProvider>
  );
}
