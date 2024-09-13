import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";
import { useAppSelector } from "@/app/_redux/hooks";
import { LineChart } from "@mui/x-charts/LineChart";

export function MileageOverviewCard(data: VehicleData | null) {
  const userPrefs = useAppSelector(selectUserPrefs);

  if (data != null) {
    if (data.odometer_data?.length > 0) {
      const style = getComputedStyle(document.body);
      const sortedData = [...data.odometer_data].sort((a, b) => a.reading - b.reading);

      // Calculate row span for masonry layout
      const rowSpan = 14 + (data.avg_mileage > 0 ? 2 : 0);

      return (
        <div className="card overview-card mileage-overview-card" style={{ gridRowEnd: "span " + rowSpan }}>
          <div className="card-title">Mileage Overview</div>
          <br />
          {data.avg_mileage > 0 ? (
            <>
              Average mileage:{" "}
              {data.avg_mileage > 0
                ? data.avg_mileage.toFixed(2) + " " + userPrefs?.distance + "/year"
                : "Insufficient data"}
              <br />
              <br />
            </>
          ) : null}
          Odometer readings:
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
            colors={[style.getPropertyValue("--color-7")]}
            height={200}
            margin={{ top: 20 }}
            grid={{ vertical: false, horizontal: true }}
            sx={{ "&&": { touchAction: "auto" } }}
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
