import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";
import { useAppSelector } from "@/app/_redux/hooks";
import { LineChart } from "@mui/x-charts/LineChart";

export function MileageOverviewCard(data: VehicleData | null) {
  const userPrefs = useAppSelector(selectUserPrefs);

  if (data != null) {
    if (data.odometer_data?.length > 0 && data.avg_mileage > 0) {
      const sortedData = [...data.odometer_data].sort((a, b) => a.reading - b.reading);

      return (
        <div className="card overview-card mileage-overview-card" style={{ gridRowEnd: "span 14" }}>
          <div className="card-title">Mileage Overview</div>
          <p></p>
          Average mileage:{" "}
          {data.avg_mileage > 0
            ? data.avg_mileage.toFixed(2) + " " + userPrefs?.distance.toLowerCase() + "s/year"
            : "Insufficient data"}
          <LineChart
            xAxis={[
              {
                data: sortedData.map((obj) => obj.date),
                scaleType: "point",
              },
            ]}
            series={[
              {
                data: sortedData.map((obj) => obj.reading),
              },
            ]}
            height={200}
            margin={{ top: 20 }}
            grid={{ vertical: false, horizontal: true }}
          />
        </div>
      );
    } else {
      return (
        <div className="card overview-card mileage-overview-card" style={{ gridRowEnd: "span 5" }}>
          <div className="card-title">Mileage Overview</div>
          <p></p>
          <div className="card-text">Add odometer reading to get an overview.</div>
        </div>
      );
    }
  } else {
    return (
      <div className="card overview-card mileage-overview-card" style={{ gridRowEnd: "span 5" }}>
        <div className="card-title">Mileage Overview</div>
        <p></p>
        <div className="card-text">Add a vehicle first.</div>
      </div>
    );
  }
}
