import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";
import { useAppSelector } from "@/app/_redux/hooks";
import { BarChart } from "@mui/x-charts/BarChart";
import { getCoef } from "../Utils";

export function InsuranceOverviewCard(data: VehicleData | null) {
  const userPrefs = useAppSelector(selectUserPrefs);

  if (data != null) {
    const style = getComputedStyle(document.body);

    if (data.insurance_data?.length > 0) {
      type insuranceCost = { year: number; cost: number };
      let yearlyCosts: insuranceCost[] = data.insurance_data.map((insuranceData) => ({
        year: Number(insuranceData["start_date"].split("-")[0]),
        cost: insuranceData.cost,
      }));

      yearlyCosts.sort((a, b) => a.year - b.year);

      const totalCost = yearlyCosts.reduce((acc, year) => {
        return acc + Number(year.cost);
      }, 0);

      // Calculate short representation coefficient (for left margin conformation)
      const plotCoef = getCoef(
        yearlyCosts.reduce((max, data) => {
          return data.cost > max ? (max = data.cost) : (max = max);
        }, 0)
      );

      return (
        <div className="card overview-card insurance-card" style={{ gridRowEnd: totalCost > 0 ? "span 16" : "span 5" }}>
          <div className="card-title">Insurance Overview</div>
          <br />
          <div className="card-text">
            <div style={{ display: "flex" }}>
              <div>Total cost: </div>
              <div className="card-dotfill"></div>
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: userPrefs.currency,
              }).format(totalCost)}
            </div>
          </div>
          <br />
          <div className="card-text">
            Yearly costs ({plotCoef > 1 ? "x" + plotCoef + " " : ""}
            {
              Intl.NumberFormat("en-US", {
                style: "currency",
                currency: userPrefs.currency,
              }).formatToParts()[0].value
            }
            ):
          </div>
          <BarChart
            xAxis={[
              {
                data: yearlyCosts.map((obj) => obj.year.toString()),
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: yearlyCosts.map((obj) => obj.cost / plotCoef),
              },
            ]}
            colors={[style.getPropertyValue("--color-7")]}
            height={200}
            margin={{ top: 20, left: 30, right: 0 }}
            grid={{ vertical: false, horizontal: true }}
            sx={{ "&&": { touchAction: "auto" } }}
          />
        </div>
      );
    } else {
      return (
        <div className="card overview-card insurance-overview-card" style={{ gridRowEnd: "span 5" }}>
          <div className="card-title">Insurance Overview</div>
          <p></p>
          <div className="card-text">Add insurance info to get an overview.</div>
        </div>
      );
    }
  } else {
    return (
      <div className="card overview-card insurance-overview-card" style={{ gridRowEnd: "span 5" }}>
        <div className="card-title">Insurance Overview</div>
        <p></p>
        <div className="card-text">Add a vehicle first.</div>
      </div>
    );
  }
}
