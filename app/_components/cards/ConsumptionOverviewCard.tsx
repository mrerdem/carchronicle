import { LineChart } from "@mui/x-charts/LineChart";

export function ConsumptionOverviewCard(data: VehicleData | null) {
  if (data != null) {
    if (data.refill_data?.length > 0 && data.avg_consumption > 0) {
      const orderedData = JSON.parse(JSON.stringify(data.refill_data));
      orderedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return (
        <div className="overview-card consumption-overview-card" style={{ gridRowEnd: "span 14" }}>
          <b>Consumption Overview</b>
          <p></p>
          <div>
            <>Average consumption: {data.avg_consumption > 0 ? data.avg_consumption.toFixed(2) + " l/year" : "N/A"}</>
          </div>
          <LineChart
            xAxis={[
              {
                data: orderedData.map((obj) => obj.date),
                scaleType: "point",
              },
            ]}
            series={[
              {
                data: orderedData.map((obj) => obj.amount),
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
        <div className="overview-card consumption-overview-card" style={{ gridRowEnd: "span 5" }}>
          <b>Consumption Overview</b>
          <p></p>
          Add more data to get an overview.
        </div>
      );
    }
  } else {
    return (
      <div className="overview-card consumption-overview-card" style={{ gridRowEnd: "span 5" }}>
        <b>Consumption Overview</b>
        <p></p>
        Add a vehicle first.
      </div>
    );
  }
}
