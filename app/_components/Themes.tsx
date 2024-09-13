import { createTheme } from "@mui/material";

export const FormTheme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
        notchedOutline: {
          borderRadius: "8px",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: 0,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginBottom: "10px",
        },
      },
    },
  },
});
