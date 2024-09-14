import { IconButton } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { capitalizeFirstLetter } from "../Utils";
import { DISTANCE_UNIT_SYMBOLS, DISTANCE_UNITS, VOLUME_UNIT_SYMBOLS, VOLUME_UNITS } from "@/app/constants";

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
      <div className="card-text">
        {fieldsWithData.map((field, index) => (
          <div key={index} style={{ display: "flex" }}>
            <div>{capitalizeFirstLetter(field).replaceAll("_", " ")}:</div>
            <div className="card-dotfill"></div>
            <div>
              {(field.includes("type")
                ? capitalizeFirstLetter(String(data[field as keyof typeof data]))
                : field.includes("cost") || field.includes("price")
                ? Intl.NumberFormat("en-US", { style: "currency", currency: userPrefs.currency }).format(
                    data[field as keyof typeof data]
                  )
                : data[field as keyof typeof data]) +
                (field.includes("reading")
                  ? " " + DISTANCE_UNIT_SYMBOLS[DISTANCE_UNITS.findIndex((item) => item === userPrefs?.distance)]
                  : "") +
                (field.includes("amount")
                  ? " " + VOLUME_UNIT_SYMBOLS[VOLUME_UNITS.findIndex((item) => item === userPrefs?.volume)]
                  : "")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
