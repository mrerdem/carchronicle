import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";
import { useAppSelector } from "@/app/_redux/hooks";
import { DISTANCE_UNIT_SYMBOLS, DISTANCE_UNITS, VOLUME_UNIT_SYMBOLS, VOLUME_UNITS } from "@/app/constants";
import { BarChart, BarPlot, ResponsiveChartContainer } from "@mui/x-charts";
import { LineChart } from "@mui/x-charts/LineChart";
import dayjs from "dayjs";

export function ConsumptionOverviewCard(data: VehicleData | null) {
  const userPrefs = useAppSelector(selectUserPrefs);

  if (data) {
    const rowSpan = {
      gridRowEnd: "span 27",
    };

    if (data.refuel_data?.length > 0) {
      const style = getComputedStyle(document.body);

      // Oder data by date
      const orderedData: RefuelData[] = JSON.parse(JSON.stringify(data.refuel_data));
      orderedData.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

      // Calculate summed values (for multiple refuels on the same day)
      const summedData = orderedData.reduce((summedData: RefuelData[], data: RefuelData) => {
        if (summedData.length === 0 || summedData[summedData.length - 1].date != data.date) {
          summedData.push(data);
        } else {
          summedData[summedData.length - 1].amount += data.amount;
          summedData[summedData.length - 1].cost += data.cost;
        }
        return summedData;
      }, []);

      return (
        <>
          <div className="card overview-card consumption-overview-card" style={rowSpan}>
            <div className="card-title">Consumption Overview</div>
            <br />
            {data.avg_consumption > 0 && data.avg_mileage > 0 ? (
              <>
                <div className="card-text">
                  {userPrefs.distance === DISTANCE_UNITS[0] && userPrefs.volume === VOLUME_UNITS[0] ? (
                    <div style={{ display: "flex" }}>
                      <div>Average:</div>
                      <div className="card-dotfill"></div>
                      <div>{((data.avg_consumption / data.avg_mileage) * 100).toFixed(2) + " L/100 km"}</div>
                    </div>
                  ) : userPrefs.distance === DISTANCE_UNITS[1] && userPrefs.volume === VOLUME_UNITS[1] ? (
                    <div style={{ display: "flex" }}>
                      <div>Average:</div>
                      <div className="card-dotfill"></div>
                      <div>{(data.avg_mileage / data.avg_consumption).toFixed(2) + " MPG"}</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex" }}>
                      <div>Average:</div>
                      <div className="card-dotfill"></div>
                      <div>
                        {(data.avg_consumption / data.avg_mileage).toFixed(2) +
                          " " +
                          VOLUME_UNIT_SYMBOLS[VOLUME_UNITS.findIndex((item) => item === userPrefs.volume)] +
                          "/" +
                          DISTANCE_UNIT_SYMBOLS[DISTANCE_UNITS.findIndex((item) => item === userPrefs.distance)]}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="card-text">Average: N/A (insufficient data)</div>
            )}
            <br />
            <div>Refuels ({VOLUME_UNIT_SYMBOLS[VOLUME_UNITS.findIndex((item) => item === userPrefs.volume)]}):</div>
            <BarChart
              xAxis={[
                {
                  data: summedData.map((obj) => obj.date),
                  scaleType: "band",
                },
              ]}
              series={[
                {
                  data: summedData.map((obj) => obj.amount),
                },
              ]}
              colors={[style.getPropertyValue("--color-7")]}
              height={200}
              margin={{ top: 20, left: 30, right: 4, bottom: 39 }} // 4: x-label is eaten on mobile with 0, 39: bold stroke bug with 40
              grid={{ vertical: false, horizontal: true }}
              sx={{ "&&": { touchAction: "auto" } }}
            />
            <div>
              Gas price (
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: userPrefs.currency,
              }).formatToParts()[0].value +
                "/" +
                VOLUME_UNIT_SYMBOLS[VOLUME_UNITS.findIndex((item) => item === userPrefs.volume)]}
              ):{" "}
            </div>
            <LineChart
              xAxis={[
                {
                  data: summedData.map((obj) => obj.date),
                  scaleType: "band",
                },
              ]}
              series={[
                {
                  data: summedData.map((obj) => obj.cost / obj.amount),
                },
              ]}
              colors={[style.getPropertyValue("--color-7")]}
              height={200}
              margin={{ top: 20, left: 30, right: 4, bottom: 39 }} // 4: x-label is eaten on mobile with 0, 39: bold stroke bug with 40
              grid={{ vertical: false, horizontal: true }}
              sx={{ "&&": { touchAction: "auto" } }}
            />
          </div>
        </>
      );
    } else {
      return (
        <div className="card overview-card consumption-overview-card" style={{ gridRowEnd: "span 5" }}>
          <div className="card-title">Consumption Overview</div>
          <br />
          <div className="card-text">Add refuel info to get an overview.</div>
        </div>
      );
    }
  } else {
    return (
      <div className="card overview-card consumption-overview-card" style={{ gridRowEnd: "span 5" }}>
        <div className="card-title">Consumption Overview</div>
        <br />
        <div className="card-text">Add a vehicle first.</div>
      </div>
    );
  }
}
