import { BarChart } from "@mui/x-charts";

export function AccidentsOverviewCard(data: VehicleData | null) {
  if (data != null) {
    if (data.accident_data?.length > 0) {
      const style = getComputedStyle(document.body);

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
          style={{ gridRowEnd: totalCount > 0 ? "span 16" : "span 5" }}
        >
          <div className="card-title">Accidents Overview</div>
          <br />
          <div className="card-text">
            <div style={{ display: "flex" }}>
              <div>Total:</div>
              <div className="card-dotfill"></div>
              <div>{totalCount}</div>
            </div>
          </div>
          <br />
          <div className="card-text">Over the years:</div>
          <BarChart
            xAxis={[
              {
                data: yearlyCounts.map((obj) => obj.year.toString()),
                scaleType: "band",
              },
            ]}
            colors={[style.getPropertyValue("--color-7")]}
            series={[{ data: yearlyCounts.map((obj) => obj.count) }]}
            height={200}
            margin={{ top: 20, left: 30, right: 10, bottom: 46 }}
            grid={{ vertical: false, horizontal: true }}
            sx={{ "&&": { touchAction: "auto" } }}
          />
        </div>
      );
    } else {
      return (
        <div className="card overview-card accidents-overview-card" style={{ gridRowEnd: "span 5" }}>
          <div className="card-title">Accidents Overview</div>
          <p></p>
          <div className="card-text">No accidents.</div>
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
