import { LineChart } from "@mui/x-charts/LineChart";

export function MileageOverviewCard(data: VehicleData | null) {
  if (data != null) {
    if (data.odometer_data?.length > 0 && data.avg_mileage > 0) {
      const sortedData = [...data.odometer_data].sort((a, b) => a.reading - b.reading);

      return (
        <div className="overview-card mileage-overview-card" style={{ gridRowEnd: "span 14" }}>
          <b>Mileage Overview</b>
          <p></p>
          Average mileage: {data.avg_mileage > 0 ? data.avg_mileage.toFixed(2) + " km/year" : "Insufficient data"}
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
        <div className="overview-card mileage-overview-card" style={{ gridRowEnd: "span 5" }}>
          <b>Mileage Overview</b>
          <p></p>
          Add more data to get an overview.
        </div>
      );
    }
  } else {
    return (
      <div className="overview-card mileage-overview-card" style={{ gridRowEnd: "span 5" }}>
        <b>Mileage Overview</b>
        <p></p>
        Add a vehicle first.
      </div>
    );
  }
}
