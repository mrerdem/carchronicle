import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";
import { useAppSelector } from "@/app/_redux/hooks";
import { DISTANCE_UNIT_SYMBOLS, DISTANCE_UNITS } from "@/app/constants";
import { LineChart } from "@mui/x-charts/LineChart";
import { getCoef } from "../Utils";

export function MileageOverviewCard(data: VehicleData | null) {
  const userPrefs = useAppSelector(selectUserPrefs);

  if (data != null) {
    if (data.odometer_data?.length > 0) {
      const style = getComputedStyle(document.body);
      const sortedData = [...data.odometer_data].sort((a, b) => a.reading - b.reading);

      // Calculate row span for masonry layout
      const rowSpan = 14 + (data.avg_mileage > 0 ? 2 : 0);

      // Calculate short representation coefficient (for left margin conformation)
      const plotCoef = getCoef(
        sortedData.reduce((max, data) => {
          return data.reading > max ? (max = data.reading) : (max = max);
        }, 0)
      );

      return (
        <div className="card overview-card mileage-overview-card" style={{ gridRowEnd: "span " + rowSpan }}>
          <div className="card-title">Mileage Overview</div>
          <br />
          {data.avg_mileage > 0 ? (
            <div className="card-text">
              <div style={{ display: "flex" }}>
                <div>Average mileage:</div>
                <div className="card-dotfill"></div>
                <div>
                  {data.avg_mileage > 0
                    ? data.avg_mileage.toFixed(2) +
                      " " +
                      DISTANCE_UNIT_SYMBOLS[DISTANCE_UNITS.findIndex((item) => item === userPrefs.distance)] +
                      "/year"
                    : "Insufficient data"}
                </div>
                <br />
              </div>
              <br />
            </div>
          ) : null}
          Odometer readings ({plotCoef > 1 ? "x" + plotCoef + " " : ""}
          {DISTANCE_UNIT_SYMBOLS[DISTANCE_UNITS.findIndex((item) => item === userPrefs.distance)]}):
          <LineChart
            xAxis={[
              {
                data: sortedData.map((obj) => obj.date),
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: sortedData.map((obj) => obj.reading / plotCoef),
              },
            ]}
            colors={[style.getPropertyValue("--color-7")]}
            height={200}
            margin={{ top: 20, left: 30, right: 10, bottom: 46 }}
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
