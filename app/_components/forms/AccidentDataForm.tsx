import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useAppSelector } from "@/app/_redux/hooks";
import { selectSessionData } from "@/app/_redux/features/session/sessionDataSlice";

interface DataEntryDialogProps {
  open: boolean;
  onSubmit: (task: string, user_id: string, data: AccidentData) => void;
  onClose: () => void;
  existingFormData: AccidentData;
}

const defaultFormData: AccidentData = {
  row: null,
  date: dayjs().toISOString().split("T")[0], // Date is mandatory, so having a default does not cause UX issue
  info: null,
};

const defaultErrors = {
  dateError: false,
};

export default function AccidentDataForm(props: DataEntryDialogProps) {
  const { onClose, onSubmit, open, existingFormData } = props;
  const [formData, setFormData] = useState<AccidentData>(defaultFormData);
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
    if (formData.date != null) {
      setErrors(defaultErrors);
      return true;
    }
    setErrors({
      dateError: !formData.date,
    });
    return false;
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      // TextField can store both string and number as string, so collect its value accordingly
      [name]:
        value === ""
          ? null
          : typeof defaultFormData[name as keyof typeof defaultFormData] === "number"
          ? e.target.valueAsNumber
          : value,
    }));
  };

  const handleSelectDateChange = (field: keyof AccidentData, value: dayjs.Dayjs | null) => {
    if (value != null) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: value?.isValid() && value.toString() != "Invalid Date" ? value.format("YYYY-MM-DD") : null,
      }));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose}>
        <div className="form-title-container">
          <DialogTitle>Accident details</DialogTitle>
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
              label="Info"
              variant="outlined"
              name="info"
              value={formData?.info ? formData.info : ""}
              onChange={handleTextInputChange}
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
