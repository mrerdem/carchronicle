import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import { FormHelperText, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useAppSelector } from "@/app/_redux/hooks";
import { selectSessionData } from "@/app/_redux/features/session/sessionDataSlice";

interface DataEntryDialogProps {
  open: boolean;
  onSubmit: (task: string, user_id: string, data: MaintenanceData) => void;
  onClose: () => void;
  existingFormData: MaintenanceData;
  userPrefs: UserPrefs;
}

const defaultFormData: MaintenanceData = {
  row: null,
  type: null,
  provider: null,
  start_date: dayjs().toISOString().split("T")[0],
  end_date: dayjs().toISOString().split("T")[0],
  work: null,
  cost: null,
};

const defaultErrors = {
  typeError: false,
  costError: false,
};

export default function MaintenanceDataForm(props: DataEntryDialogProps) {
  const { onClose, onSubmit, open, existingFormData, userPrefs } = props;
  const [formData, setFormData] = useState<MaintenanceData>(defaultFormData);
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
    if (formData.type != null && formData.cost != null) {
      setErrors(defaultErrors);
      return true;
    }
    setErrors({
      typeError: !formData.type,
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

  const handleSelectDateChange = (field: keyof MaintenanceData, value: dayjs.Dayjs) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value?.isValid && value.toString() != "Invalid Date" ? value.format("YYYY-MM-DD") : null,
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose}>
        <div className="form-title-container">
          <DialogTitle>Maintenance/repair details</DialogTitle>
          <IconButton onClick={handleReset}>
            <RestartAltIcon />
          </IconButton>
        </div>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              "& .MuiFormControl-root": {
                mb: 1,
              },
              paddingTop: 1,
            }}
            autoComplete="off"
            display={"flex"}
            flexDirection={"column"}
          >
            <FormControl error={errors.typeError} required>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={formData?.type ? formData.type : ""}
                onChange={handleTextInputChange}
                inputProps={{
                  name: "type",
                }}
              >
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="repair">Repair</MenuItem>
              </Select>
              <FormHelperText>{errors.typeError && "This field is required"}</FormHelperText>
            </FormControl>
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
            />
            <DatePicker
              label="End date"
              value={formData?.end_date ? dayjs(formData.end_date) : dayjs(defaultFormData.end_date)}
              onChange={(newValue) => handleSelectDateChange("end_date", newValue)}
            />
            <TextField
              id="standard-basic"
              label="Work"
              variant="outlined"
              name="work"
              value={formData?.work ? formData.work : ""}
              onChange={handleTextInputChange}
            />
            <TextField
              required
              id="standard-basic"
              label={"Cost (" + userPrefs?.currency + ")"}
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
    </LocalizationProvider>
  );
}
