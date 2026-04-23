import {
  createTheme,
  unstable_createMuiStrictModeTheme,
} from "@mui/material/styles";

import ExpandMore from "@mui/icons-material/ExpandMore";

//================================================

const titleFontStyle = {
  fontFamily: "var(--font-title)",
};

/*
  https://github.com/mui-org/material-ui/issues/13394
  https://v4.mui.com/customization/theming/#unstable-createmuistrictmodetheme-options-args-theme
*/
const createMuiThemeForEnvironment =
  import.meta.env.NODE_ENV === "production"
    ? createTheme
    : unstable_createMuiStrictModeTheme;

export const MuiTheme = createMuiThemeForEnvironment({
  cssVariables: true,
  spacing: 4,
  palette: {
    mode: "dark",
    primary: {
      main: "#107bfc",
    },
    secondary: {
      light: "#fdcc31",
      main: "#fdb515",
      dark: "#fd9a14",
    },
  },
  typography: {
    fontFamily: "var(--font-default)",
    htmlFontSize: 16,
    button: {
      fontWeight: 400,
      fontFamily: "var(--font-button)",
      // textTransform: "none",
    },
    h1: titleFontStyle,
    h2: titleFontStyle,
    h3: titleFontStyle,
    h4: titleFontStyle,
    h5: titleFontStyle,
    h6: titleFontStyle,
  },
  components: {
    MuiTooltip: {
      defaultProps: {
        arrow: true,
        placement: "top",
        enterDelay: 500,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        sizeLarge: {
          fontWeight: 500,
          fontSize: "1rem",
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        disableTouchRipple: true,
      },
      styleOverrides: {
        root: {
          "&:not(:hover):not(:active)": {
            opacity: 0.7,
          },
        },
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "medium",
      },
    },
    MuiSelect: {
      defaultProps: {
        IconComponent: ExpandMore,
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        size: "medium",
      },
    },
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiList: {
      defaultProps: {
        disablePadding: true,
      },
    },
    MuiListItem: {
      defaultProps: {
        disableGutters: true,
      },
    },
    MuiMenu: {
      defaultProps: {
        slotProps: {
          paper: {
            variant: "elevation",
            elevation: 8,
          },
        },
        keepMounted: true,
      },
    },
    MuiMenuItem: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiDialog: {
      defaultProps: {
        slotProps: {
          paper: {
            elevation: 24,
          },
        },
      },
      styleOverrides: {
        paper: ({ theme }) => ({
          background: theme.palette.background.paper,
        }),
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paperChannel,
        }),
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiPaper-root": {
            background: theme.palette.background.paperChannel,
          },
        }),
      },
    },
    MuiSkeleton: {
      defaultProps: {
        animation: "wave",
      },
    },
  },
});

// type Override = Exclude<EntryOf<ComponentsOverrides<Theme>>, undefined>;
// (Object.entries(overrides) as Override[]).forEach(([key, styles]) => {
//   if (!themeCustomization.components) {
//     themeCustomization.components = {};
//   }
//   if (!themeCustomization.components[key]) {
//     themeCustomization.components[key] = {};
//   }
//   themeCustomization.components[key]!.styleOverrides = styles;
// });
