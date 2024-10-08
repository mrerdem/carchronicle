import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";
import { useAppSelector } from "@/app/_redux/hooks";
import { PieChart } from "@mui/x-charts/PieChart";

export function MaintenanceOverviewCard(data: VehicleData | null) {
  const userPrefs = useAppSelector(selectUserPrefs);

  if (data != null) {
    const style = getComputedStyle(document.body);

    if (data.maintenance_data?.length > 0) {
      const totalMaintenanceCost = data.maintenance_data.reduce((total, data) => {
        return data.type === "maintenance" ? total + Number(data.cost) : total;
      }, 0);
      const totalRepairCost = data.maintenance_data.reduce((total, data) => {
        return data.type === "repair" ? total + Number(data.cost) : total;
      }, 0);
      let totalServiceCost = totalMaintenanceCost + totalRepairCost;

      return (
        <div
          className="card overview-card maintenance-card"
          id="maintenance-card"
          style={{ gridRowEnd: totalServiceCost > 0 ? "span 14" : "span 5" }}
        >
          <div className="card-title">Maintenance/Repair Overview</div>
          <br />
          <div className="card-text">
            <div style={{ display: "flex" }}>
              <div>Total cost:</div>
              <div className="card-dotfill"></div>
              <div>
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: userPrefs.currency,
                }).format(totalServiceCost)}
              </div>
            </div>
          </div>
          {totalServiceCost > 0 && (
            <PieChart
              series={[
                {
                  arcLabel: (item) => `${item.value > 0 ? item.value.toFixed(2) : ""}`,
                  data: [
                    {
                      id: 0,
                      value: totalMaintenanceCost,
                      color: style.getPropertyValue("--color-7"),
                      label: "M",
                    },
                    {
                      id: 1,
                      value: totalRepairCost,
                      color: style.getPropertyValue("--color-8"),
                      label: "R",
                    },
                  ],
                },
              ]}
              height={200}
              margin={{ top: 20, left: 0, right: 0, bottom: 20 }}
              sx={{ "&&": { touchAction: "auto" } }}
              tooltip={{ trigger: "none" }}
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
