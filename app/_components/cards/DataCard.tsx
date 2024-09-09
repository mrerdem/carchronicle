import { IconButton } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { capitalizeFirstLetter } from "../Utils";

export function DataCard(
  key: number,
  title: string,
  data: VehicleData | InsuranceData | MaintenanceData | AccidentData | TicketData | RefuelData | OdometerData,
  fields: string[],
  userPrefs: UserPrefs,
  handleEditButtonClick: (value: number) => void
) {
  const fieldsWithData: string[] = [];
  fields.forEach((field) => {
    const value = data[field as keyof typeof data];
    if (value != null && (typeof value !== "string" || value !== "")) {
      fieldsWithData.push(field);
    }
  });
  const rowSpan = fieldsWithData.length + 4;

  const handleClick = () => {
    handleEditButtonClick(data.row);
  };

  return (
    <div key={key} className="card data-card mileage-data-card" style={{ gridRowEnd: "span " + rowSpan }}>
      <div>
        <div className="card-title-container">
          <div className="card-title">{title}</div>
          <IconButton onClick={handleClick}>
            <EditRoundedIcon />
          </IconButton>
        </div>
      </div>
      <div>
        {fieldsWithData.map((field, index) => (
          <div key={index}>
            {capitalizeFirstLetter(field).replaceAll("_", " ")}:
            {" " +
              (field.includes("cost") || field.includes("price") ? userPrefs?.currency + " " : "") +
              (field.includes("cost") || field.includes("price") || field.includes("amount")
                ? data[field as keyof typeof data].toFixed(2)
                : data[field as keyof typeof data]) +
              (field.includes("reading") ? " " + userPrefs?.distance.toLowerCase() : "") +
              (field.includes("amount") ? " " + userPrefs?.volume.toLowerCase() : "")}
          </div>
        ))}
      </div>
    </div>
  );
}
