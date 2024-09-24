import { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormTheme } from "../Themes";
import { GoogleLoginButton } from "../loginButtons/GoogleLoginButton";

interface LoginFormProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginForm(props: LoginFormProps) {
  const { open, onClose } = props;

  useEffect(() => {}, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={FormTheme}>
        <Dialog open={open} onClose={onClose}>
          <div className="login-button-container">
            <GoogleLoginButton />
          </div>
          <div className="form-button-container">
            {
              <button className="button close-button right-most-button" onClick={onClose}>
                Cancel
              </button>
            }
          </div>
        </Dialog>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
