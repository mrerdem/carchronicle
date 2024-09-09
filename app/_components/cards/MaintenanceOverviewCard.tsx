import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";
import { useAppSelector } from "@/app/_redux/hooks";
import { PieChart } from "@mui/x-charts/PieChart";

export function MaintenanceOverviewCard(data: VehicleData | null) {
  const userPrefs = useAppSelector(selectUserPrefs);

  if (data != null) {
    if (data.maintenance_data?.length > 0) {
      const totalMaintenanceCost = data.maintenance_data.reduce((total, data) => {
        return data.type === "Maintenance" ? total + Number(data.cost) : total;
      }, 0);
      const totalRepairCost = data.maintenance_data.reduce((total, data) => {
        return data.type === "Repair" ? total + Number(data.cost) : total;
      }, 0);
      let totalServiceCost = totalMaintenanceCost + totalRepairCost;

      return (
        <div
          className="card overview-card maintenance-card"
          id="maintenance-card"
          style={{ gridRowEnd: totalServiceCost > 0 ? "span 14" : "span 5" }}
        >
          <div className="card-title">Maintenance/Repair Overview</div>
          <p></p>
          Total service cost: {userPrefs.currency + " " + totalServiceCost.toFixed(2)}
          <br />
          {totalServiceCost > 0 && (
            <PieChart
              series={[
                {
                  data: [
                    {
                      value: totalMaintenanceCost,
                      color: "#6E7DAB",
                      label: "Total\nmaintenance\ncost",
                    },
                    {
                      value: totalRepairCost,
                      color: "#82DDF0",
                      label: "Total\nrepair\ncost",
                    },
                  ],
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: { innerRadius: 0, additionalRadius: 0, color: "gray" },
                },
              ]}
              height={200}
              margin={{
                top: 20,
                bottom: 20,
              }}
            />
          )}
        </div>
      );
    } else {
      return (
        <div className="card overview-card maintenance-overview-card" style={{ gridRowEnd: "span 5" }}>
          <div className="card-title">Maintenance/Repair Overview</div>
          <p></p>
          <div className="card-text">Add maintenance/repair info to get an overview.</div>
        </div>
      );
    }
  } else {
    return (
      <div className="card overview-card maintenance-overview-card" style={{ gridRowEnd: "span 5" }}>
        <div className="card-title">Maintenance/Repair Overview</div>
        <p></p>
        <div className="card-text">Add a vehicle first.</div>
      </div>
    );
  }
}
