import { BarChart } from "@mui/x-charts/BarChart";

export function InsuranceOverviewCard(data: VehicleData | null) {
  if (data != null) {
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

      return (
        <div className="overview-card insurance-card" style={{ gridRowEnd: totalCost > 0 ? "span 14" : "span 5" }}>
          <b>Insurance Overview</b>
          <p></p>
          Total cost: {totalCost.toFixed(2)}
          <br />
          <BarChart
            xAxis={[
              {
                data: yearlyCosts.map((obj) => obj.year.toString()),
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: yearlyCosts.map((obj) => obj.cost),
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
        <div className="overview-card insurance-overview-card" style={{ gridRowEnd: "span 5" }}>
          <b>Insurance Overview</b>
          <p></p>
          Add more data to get an overview.
        </div>
      );
    }
  } else {
    return (
      <div className="overview-card insurance-overview-card" style={{ gridRowEnd: "span 5" }}>
        <b>Insurance Overview</b>
        <p></p>
        Add a vehicle first.
      </div>
    );
  }
}
