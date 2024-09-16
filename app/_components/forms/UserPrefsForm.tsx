import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  ThemeProvider,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useAppSelector } from "@/app/_redux/hooks";
import { selectSessionData } from "@/app/_redux/features/session/sessionDataSlice";
import { CURRENCIES, DISTANCE_UNIT_SYMBOLS, DISTANCE_UNITS, VOLUME_UNIT_SYMBOLS, VOLUME_UNITS } from "@/app/constants";
import { capitalizeFirstLetter } from "../Utils";
import { FormTheme } from "../Themes";

interface DataEntryDialogProps {
  open: boolean;
  onSubmit: (user_id: string, data: UserPrefs) => void;
  onClose: () => void;
  existingFormData: UserPrefs;
  cancellable: boolean;
}

const defaultFormData: UserPrefs = {
  currency: "CAD",
  volume: VOLUME_UNITS[0],
  distance: DISTANCE_UNITS[0],
};

const defaultErrors = {
  currencyError: false,
  volumeError: false,
  distanceError: false,
};

export default function UserPrefsForm(props: DataEntryDialogProps) {
  const { onClose, onSubmit, open, existingFormData, cancellable } = props;
  const [formData, setFormData] = useState<UserPrefs>(defaultFormData);
  const [errors, setErrors] = useState(defaultErrors);
  const sessionData = useAppSelector(selectSessionData);

  // Fill in the form with existing data if provided
  useEffect(() => {
    if (existingFormData === null) {
      setFormData(defaultFormData);
    } else {
      setFormData(existingFormData);
    }
  }, [existingFormData]);

  const handleReset = () => {
    setFormData(defaultFormData);
    setErrors(defaultErrors);
  };

  const handleClose = () => {
    if (cancellable) {
      onClose();
      setErrors(defaultErrors);
    }
  };

  const handleAdd = () => {
    if (formDataCheck()) {
      onSubmit(sessionData.id, formData);
    }
    setFormData(defaultFormData);
  };

  const formDataCheck = () => {
    if (formData.currency != null && formData.volume != null && formData.distance != null) {
      setErrors(defaultErrors);
      return true;
    }
    setErrors({
      currencyError: !formData.currency,
      volumeError: !formData.volume,
      distanceError: !formData.distance,
    });
    return false;
  };

  const handleSelectInputChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      // TextField can store both string and number as string, so collect its value accordingly
      [name]: value === "" ? null : value,
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={FormTheme}>
        <Dialog open={open} onClose={handleClose}>
          <div className="form-title-container">
            <DialogTitle>User preferences</DialogTitle>
            <IconButton onClick={handleReset}>
              <RestartAltIcon />
            </IconButton>
          </div>
          <DialogContent>
            <Box noValidate component="form" autoComplete="off" display={"flex"} flexDirection={"column"}>
              <FormControl error={errors.currencyError} required>
                <InputLabel htmlFor="max-width">Currency</InputLabel>
                <Select
                  required
                  label="Currency"
                  value={formData.currency ? formData.currency : ""}
                  onChange={handleSelectInputChange}
                  inputProps={{
                    name: "currency",
                    error: errors.currencyError,
                  }}
                >
                  {CURRENCIES.map((unit, index) => (
                    <MenuItem key={index} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.currencyError && "This field is required"}</FormHelperText>
              </FormControl>
              <FormControl error={errors.volumeError} required>
                <InputLabel htmlFor="max-width">Volume unit</InputLabel>
                <Select
                  required
                  label="Volume unit"
                  value={formData.volume ? formData.volume : ""}
                  onChange={handleSelectInputChange}
                  inputProps={{
                    name: "volume",
                    error: errors.volumeError,
                  }}
                >
                  {VOLUME_UNITS.map((unit, index) => (
                    <MenuItem key={index} value={unit}>
                      {capitalizeFirstLetter(unit) + " (" + VOLUME_UNIT_SYMBOLS[index] + ")"}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.volumeError && "This field is required"}</FormHelperText>
              </FormControl>
              <FormControl error={errors.distanceError} required>
                <InputLabel htmlFor="max-width">Distance unit</InputLabel>
                <Select
                  required
                  label="Distance unit"
                  value={formData.distance ? formData.distance : ""}
                  onChange={handleSelectInputChange}
                  inputProps={{
                    name: "distance",
                    error: errors.distanceError,
                  }}
                >
                  {DISTANCE_UNITS.map((unit, index) => (
                    <MenuItem key={index} value={unit}>
                      {capitalizeFirstLetter(unit) + " (" + DISTANCE_UNIT_SYMBOLS[index] + ")"}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.distanceError && "This field is required"}</FormHelperText>
              </FormControl>
            </Box>
          </DialogContent>
          <div className="form-button-container">
            {cancellable ? (
              <button className="button close-button" onClick={handleClose}>
                Cancel
              </button>
            ) : null}
            {
              <button className="button add-button" onClick={handleAdd}>
                Set
              </button>
            }
          </div>
        </Dialog>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
