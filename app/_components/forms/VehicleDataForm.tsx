import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FormHelperText, IconButton, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { VEHICLE_TYPES } from "@/app/constants";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { capitalizeFirstLetter } from "../Utils";

const defaultFormData: VehicleData = {
  row: null,
  type: null,
  make: null,
  model: null,
  trim: null,
  year: null,
  color: null,
  plate: null,
  vin: null,
  fuel_type: null,
  purchase_date: null,
  purchase_price: null,
  sell_date: null,
  sell_price: null,
  avg_mileage: null,
  avg_consumption: null,
  refuel_data: null,
  odometer_data: null,
  insurance_data: null,
  maintenance_data: null,
  accident_data: null,
  ticket_data: null,
  details: null,
};

const defaultErrors = {
  typeError: false,
  makeError: false,
  modelError: false,
};

interface DataEntryDialogProps {
  open: boolean;
  onSubmit: (task: string, data: VehicleData) => void;
  onClose: () => void;
  existingFormData: VehicleData | null;
}

export default function VehicleDataForm(props: DataEntryDialogProps) {
  const { open, onSubmit, onClose, existingFormData } = props;
  const [formData, setFormData] = useState<VehicleData>(defaultFormData);
  const [errors, setErrors] = useState(defaultErrors);

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

  const handleAdd = () => {
    if (formDataCheck()) {
      onSubmit("insert", formData);
    }
    setFormData(defaultFormData);
  };

  const handleUpdate = () => {
    if (formDataCheck()) {
      onSubmit("update", formData);
    }
  };

  const handleDelete = () => {
    onSubmit("delete", formData);
  };

  const handleClose = () => {
    onClose();
    setErrors(defaultErrors);
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

  const handleSelectInputChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      // TextField can store both string and number as string, so collect its value accordingly
      [name]: value === "" ? null : value,
    }));
  };

  const handleSelectDateChange = (field: keyof VehicleData, value: dayjs.Dayjs | null) => {
    if (value != null) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: value?.isValid() && value.toString() != "Invalid Date" ? value.format("YYYY-MM-DD") : null,
      }));
    }
  };

  const formDataCheck = () => {
    if (formData.type && formData.make && formData.model) {
      setErrors(defaultErrors);
      return true;
    }
    setErrors({
      typeError: !formData.type,
      makeError: !formData.make,
      modelError: !formData.model,
    });
    return false;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose}>
        <div className="form-title-container">
          <DialogTitle>Vehicle details</DialogTitle>
          <IconButton onClick={handleReset}>
            <RestartAltIcon />
          </IconButton>
        </div>
        <DialogContent>
          <Box
            component="form"
            noValidate
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
              <InputLabel htmlFor="max-width">Vehicle type</InputLabel>
              <Select
                required
                label="Vehicle type"
                value={formData.type ? formData.type : ""}
                onChange={handleSelectInputChange}
                inputProps={{
                  name: "type",
                  error: errors.typeError,
                }}
              >
                {VEHICLE_TYPES.map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {capitalizeFirstLetter(type)}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.typeError && "This field is required"}</FormHelperText>
            </FormControl>
            <TextField
              required
              id="standard-basic"
              label="Make"
              value={formData.make ? formData.make : ""}
              variant="outlined"
              name="make"
              onChange={handleTextInputChange}
              error={errors.makeError}
              helperText={errors.makeError && "This field is required"}
            />
            <TextField
              required
              id="standard-basic"
              label="Model"
              value={formData.model ? formData.model : ""}
              variant="outlined"
              name="model"
              onChange={handleTextInputChange}
              error={errors.modelError}
              helperText={errors.modelError && "This field is required"}
            />
            <TextField
              id="standard-basic"
              label="Trim"
              value={formData.trim ? formData.trim : ""}
              variant="outlined"
              name="trim"
              onChange={handleTextInputChange}
            />
            <TextField
              id="standard-basic"
              label="Model year"
              variant="outlined"
              name="year"
              value={formData.year ? formData.year : ""}
              type="number"
              inputMode="numeric"
              onChange={handleNumberInputChange}
            />
            <TextField
              id="standard-basic"
              label="Color"
              value={formData.color ? formData.color : ""}
              variant="outlined"
              name="color"
              onChange={handleTextInputChange}
            />
            <TextField
              id="standard-basic"
              label="Plate"
              value={formData.plate ? formData.plate : ""}
              variant="outlined"
              name="plate"
              onChange={handleTextInputChange}
            />
            <TextField
              id="standard-basic"
              label="VIN"
              value={formData.vin ? formData.vin : ""}
              variant="outlined"
              name="vin"
              onChange={handleTextInputChange}
            />
            <FormControl>
              <InputLabel id="fuel-type-label">Fuel type</InputLabel>
              <Select
                labelId="fuel-type-label"
                label="Fuel type"
                value={formData.fuel_type ? formData.fuel_type : ""}
                onChange={handleSelectInputChange}
                inputProps={{
                  name: "fuel_type",
                }}
              >
                <MenuItem value="petrol">Petrol</MenuItem>
                <MenuItem value="diesel">Diesel</MenuItem>
              </Select>
            </FormControl>
            <DatePicker
              label="Purchase date"
              onChange={(newValue) => handleSelectDateChange("purchase_date", newValue)}
              value={formData.purchase_date ? dayjs(formData.purchase_date) : null}
            />
            <TextField
              id="standard-basic"
              label="Purchase price"
              value={formData.purchase_price ? formData.purchase_price : ""}
              variant="outlined"
              name="purchase_price"
              type="number"
              inputMode="numeric"
              onChange={handleNumberInputChange}
            />
            <DatePicker
              label="Sell date"
              onChange={(newValue) => handleSelectDateChange("sell_date", newValue)}
              value={formData.sell_date ? dayjs(formData.sell_date) : null}
            />
            <TextField
              id="standard-basic"
              label="Sell price"
              value={formData.sell_price ? formData.sell_price : ""}
              variant="outlined"
              name="sell_price"
              type="number"
              inputMode="numeric"
              onChange={handleNumberInputChange}
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
