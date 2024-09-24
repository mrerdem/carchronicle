import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, TextField, ThemeProvider } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useAppSelector } from "@/app/_redux/hooks";
import { selectSessionData } from "@/app/_redux/features/session/sessionDataSlice";
import { FormTheme } from "../Themes";

interface DataEntryDialogProps {
  open: boolean;
  onSubmit: (task: string, user_id: string, data: InsuranceData) => void;
  onClose: () => void;
  existingFormData: InsuranceData;
  userPrefs: UserPrefs;
}

const defaultFormData: InsuranceData = {
  row: null,
  provider: null,
  start_date: dayjs().toISOString().split("T")[0],
  end_date: dayjs().add(1, "year").toISOString().split("T")[0],
  cost: null,
};

const defaultErrors = {
  startDateError: false,
  endDateError: false,
  costError: false,
};

export default function InsuranceDataForm(props: DataEntryDialogProps) {
  const { onClose, onSubmit, open, existingFormData, userPrefs } = props;
  const [formData, setFormData] = useState<InsuranceData>(defaultFormData);
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
    onClose();
    setErrors(defaultErrors);
  };

  const handleAdd = () => {
    if (formDataCheck()) {
      onSubmit("add", sessionData.id, formData);
    }
    setFormData(defaultFormData);
  };

  const handleUpdate = () => {
    if (formDataCheck()) {
      onSubmit("update", sessionData.id, formData);
    }
  };

  const handleDelete = () => {
    onSubmit("delete", sessionData.id, formData);
  };

  const formDataCheck = () => {
    if (formData.start_date != null && formData.end_date != null && formData.cost != null) {
      setErrors(defaultErrors);
      return true;
    }
    setErrors({
      startDateError: !formData.start_date,
      endDateError: !formData.end_date,
      costError: !formData.cost,
    });
    return false;
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value === "" ? null : value,
    }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value === "" ? null : e.target.valueAsNumber,
    }));
  };

  const handleSelectDateChange = (field: keyof InsuranceData, value: dayjs.Dayjs) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value?.isValid && value.toString() != "Invalid Date" ? value.format("YYYY-MM-DD") : null,
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={FormTheme}>
        <Dialog open={open} onClose={handleClose}>
          <div className="form-title-container">
            <DialogTitle>Insurance details</DialogTitle>
            <IconButton onClick={handleReset}>
              <RestartAltIcon />
            </IconButton>
          </div>
          <DialogContent>
            <Box noValidate component="form" autoComplete="off" display={"flex"} flexDirection={"column"}>
              <TextField
                id="standard-basic"
                label="Provider"
                variant="outlined"
                name="provider"
                value={formData?.provider ? formData.provider : ""}
                onChange={handleTextInputChange}
              />
              <DatePicker
                label="Start date"
                value={formData?.start_date ? dayjs(formData.start_date) : dayjs(defaultFormData.start_date)}
                onChange={(newValue) => handleSelectDateChange("start_date", newValue)}
                slotProps={{
                  textField: {
                    required: true,
                    error: errors.startDateError,
                    helperText: errors.startDateError && "This field is required",
                  },
                }}
              />
              <DatePicker
                label="End date"
                value={formData?.end_date ? dayjs(formData.end_date) : dayjs(defaultFormData.end_date)}
                onChange={(newValue) => handleSelectDateChange("end_date", newValue)}
                slotProps={{
                  textField: {
                    required: true,
                    error: errors.endDateError,
                    helperText: errors.endDateError && "This field is required",
                  },
                }}
              />
              <TextField
                required
                id="standard-basic"
                label={
                  userPrefs?.currency
                    ? "Cost (" +
                      Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: userPrefs.currency,
                      }).formatToParts()[0].value +
                      ")"
                    : ""
                }
                variant="outlined"
                name="cost"
                value={formData?.cost ? formData.cost : ""}
                type="number"
                inputMode="numeric"
                onChange={handleNumberInputChange}
                error={errors.costError}
                helperText={errors.costError && "This field is required"}
              />
            </Box>
          </DialogContent>
          <div className="form-button-container">
            {existingFormData && (
              <button className="button delete-button" onClick={handleDelete}>
                Delete
              </button>
            )}
            <button className="button close-button" onClick={handleClose}>
              Cancel
            </button>
            {!existingFormData && (
              <button className="button add-button right-most-button" onClick={handleAdd}>
                Add
              </button>
            )}
            {existingFormData && (
              <button className="button update-button right-most-button" onClick={handleUpdate}>
                Update
              </button>
            )}
          </div>
        </Dialog>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
