import { BarChart } from "@mui/x-charts";

export function AccidentsOverviewCard(data: VehicleData | null) {
  if (data != null) {
    if (data.accident_data?.length > 0) {
      type accidentYear = { year: number; count: number };
      let accidentYears: accidentYear[] = data.accident_data.map((accidentData, index) => ({
        year: Number(accidentData.date.split("-")[0]),
        count: 1,
      }));

      let yearlyCounts: accidentYear[] = accidentYears.reduce((acc: accidentYear[], obj: accidentYear) => {
        let i = acc.findIndex((ticket) => ticket.year === obj.year);
        if (i !== -1) {
          acc[i].count += 1;
        } else {
          acc.push({ year: obj.year, count: obj.count });
        }
        return acc;
      }, []);

      yearlyCounts.sort((a, b) => a.year - b.year);

      const totalCount = yearlyCounts.reduce((acc, year) => {
        return (acc += year.count);
      }, 0);

      return (
        <div
          className="card overview-card accidents-overview-card"
          style={{ gridRowEnd: totalCount > 0 ? "span 14" : "span 5" }}
        >
          <div className="card-title">Accidents Overview</div>
          <p></p>
          Total: {totalCount}
          <br />
          <BarChart
            xAxis={[
              {
                data: yearlyCounts.map((obj) => obj.year.toString()),
                scaleType: "band",
              },
            ]}
            series={[{ data: yearlyCounts.map((obj) => obj.count) }]}
            height={200}
            margin={{ top: 20 }}
            grid={{ vertical: false, horizontal: true }}
          />
        </div>
      );
    } else {
      return (
        <div className="card overview-card accidents-overview-card" style={{ gridRowEnd: "span 5" }}>
          <div className="card-title">Accidents Overview</div>
          <p></p>
          <div className="card-text">Add accident info to get an overview.</div>
        </div>
      );
    }
  } else {
    return (
      <div className="card overview-card accidents-overview-card" style={{ gridRowEnd: "span 5" }}>
        <div className="card-title">Accidents Overview</div>
        <p></p>
        <div className="card-text">Add a vehicle first.</div>
      </div>
    );
  }
}
