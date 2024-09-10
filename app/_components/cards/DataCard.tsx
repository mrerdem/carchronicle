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
              (field.includes("type")
                ? capitalizeFirstLetter(String(data[field as keyof typeof data]))
                : field.includes("cost") || field.includes("price")
                ? Intl.NumberFormat("en-US", { style: "currency", currency: userPrefs.currency }).format(
                    data[field as keyof typeof data]
                  )
                : data[field as keyof typeof data]) +
              (field.includes("reading") ? " " + userPrefs?.distance : "") +
              (field.includes("amount") ? " " + userPrefs?.volume : "")}
          </div>
        ))}
      </div>
    </div>
  );
}
