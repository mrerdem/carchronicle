import { IconButton } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

export function DataCard(
  key: number,
  title: string,
  data: VehicleData | InsuranceData | MaintenanceData | AccidentData | TicketData | RefillData | OdometerData,
  fields: string[],
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
    <div key={key} className="data-card mileage-data-card" style={{ gridRowEnd: "span " + rowSpan }}>
      <div>
        <div className="card-title-container">
          <b>{title}</b>
          <IconButton onClick={handleClick}>
            <EditRoundedIcon />
          </IconButton>
        </div>
      </div>
      <div>
        {fieldsWithData.map((field, index) => (
          <div key={index}>
            {field.charAt(0).toUpperCase() + field.slice(1).replaceAll("_", " ")}: {data[field as keyof typeof data]}
          </div>
        ))}
      </div>
    </div>
  );
}
