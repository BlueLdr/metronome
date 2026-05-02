import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import { MuiTheme } from "./Theme";

import GlobalStyles from "@mui/material/GlobalStyles";

//================================================

const useGlobalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      html: {
        height: "100%",
        fontOpticalSizing: "auto",
        "--font-default": "Onest",
        "--font-title": "Onest",

        "--font-button": "Onest",
        "--font-number-input": "Roboto Flex",
        "--font-bpm-ticks": "Reddit Sans Condensed",
        backgroundColor: theme.palette.background.default,
      },
      body: {
        margin: 0,
        height: "100%",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      "#root": {
        display: "grid",
        // gridTemplateColumns: "auto 1fr",
        minHeight: "100vh",
      },
    })}
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
