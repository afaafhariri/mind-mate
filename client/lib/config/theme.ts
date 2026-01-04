"use client";

import { createTheme } from "@mui/material/styles";

export const BRAND_COLOR = "#1C274C";

export const theme = createTheme({
  palette: {
    primary: {
      main: BRAND_COLOR,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});
