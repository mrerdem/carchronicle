import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";
import { useAppSelector } from "@/app/_redux/hooks";
import { BarChart } from "@mui/x-charts";
import { LineChart } from "@mui/x-charts/LineChart";
import dayjs from "dayjs";

export function ConsumptionOverviewCard(data: VehicleData | null) {
  const userPrefs = useAppSelector(selectUserPrefs);

  const rowSpan = { gridRowEnd: data?.avg_consumption > 0 ? "span 27" : "span 25" };

  if (data) {
    if (data.refuel_data?.length > 0) {
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
            <p></p>
            <div>
              {data.avg_consumption > 0 ? (
                <>
                  Average consumption:{" "}
                  {data.avg_consumption > 0
                    ? data.avg_consumption.toFixed(2) + " " + userPrefs?.volume.toLowerCase() + "/year"
                    : "N/A"}
                </>
              ) : null}
            </div>
            <p></p>
            <div>Refuels:</div>
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
              height={200}
              margin={{ top: 20 }}
              grid={{ vertical: false, horizontal: true }}
            />
            <div>
              Gas price (
              {Intl.NumberFormat("en-US", { style: "currency", currency: userPrefs.currency }).formatToParts()[0]
                .value +
                "/" +
                userPrefs.volume.toLowerCase()}
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
              height={200}
              margin={{ top: 20 }}
              grid={{ vertical: false, horizontal: true }}
            />
          </div>
        </>
      );
    } else {
      return (
        <div className="card overview-card consumption-overview-card" style={{ gridRowEnd: "span 5" }}>
          <div className="card-title">Consumption Overview</div>
          <p></p>
          <div className="card-text">Add refuel info to get an overview.</div>
        </div>
      );
    }
  } else {
    return (
      <div className="card overview-card consumption-overview-card" style={{ gridRowEnd: "span 5" }}>
        <div className="card-title">Consumption Overview</div>
        <p></p>
        <div className="card-text">Add a vehicle first.</div>
      </div>
    );
  }
}
