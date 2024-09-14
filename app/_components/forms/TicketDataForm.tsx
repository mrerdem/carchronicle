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
  onSubmit: (task: string, user_id: string, data: TicketData) => void;
  onClose: () => void;
  existingFormData: TicketData;
  userPrefs: UserPrefs;
}

const defaultFormData: TicketData = {
  row: null,
  date: dayjs().toISOString().split("T")[0],
  reason: null,
  cost: null,
};

const defaultErrors = {
  dateError: false,
  costError: false,
};

export default function TicketDataForm(props: DataEntryDialogProps) {
  const { onClose, onSubmit, open, existingFormData, userPrefs } = props;
  const [formData, setFormData] = useState<TicketData>(defaultFormData);
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
    if (formData.date != null && formData.cost != null) {
      setErrors(defaultErrors);
      return true;
    }
    setErrors({
      dateError: !formData.date,
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

  const handleSelectDateChange = (field: keyof TicketData, value: dayjs.Dayjs) => {
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
            <DialogTitle>Ticket details</DialogTitle>
            <IconButton onClick={handleReset}>
              <RestartAltIcon />
            </IconButton>
          </div>
          <DialogContent>
            <Box noValidate component="form" autoComplete="off" display={"flex"} flexDirection={"column"}>
              <DatePicker
                label="Date"
                value={formData?.date ? dayjs(formData.date) : dayjs(defaultFormData.date)}
                onChange={(newValue) => handleSelectDateChange("date", newValue)}
                slotProps={{
                  textField: {
                    required: true,
                    error: errors.dateError,
                    helperText: errors.dateError && "This field is required",
                  },
                }}
              />
              <TextField
                id="standard-basic"
                label="Reason"
                variant="outlined"
                name="reason"
                value={formData?.reason ? formData.reason : ""}
                onChange={handleTextInputChange}
              />
              <TextField
                required
                id="standard-basic"
                label={"Cost (" + userPrefs?.currency + ")"}
                variant="outlined"
                name="cost"
                value={formData?.cost ? formData.cost : ""}
                onChange={handleNumberInputChange}
                type="number"
                inputMode="numeric"
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
              <button className="button add-button" onClick={handleAdd}>
                Add
              </button>
            )}
            {existingFormData && (
              <button className="button update-button" onClick={handleUpdate}>
                Update
              </button>
            )}
          </div>
        </Dialog>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
