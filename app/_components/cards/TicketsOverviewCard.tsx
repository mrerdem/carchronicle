import { BarChart } from "@mui/x-charts/BarChart";

export function TicketsOverviewCard(data: VehicleData | null) {
  if (data != null) {
    if (data.ticket_data?.length > 0) {
      type TicketCost = { year: number; cost: number };

      let ticketCosts: TicketCost[] = data.ticket_data.map((ticketData, index) => ({
        year: Number(ticketData.date.split("-")[0]),
        cost: ticketData.cost,
      }));

      let yearlyCosts: TicketCost[] = ticketCosts.reduce((acc: TicketCost[], obj: TicketCost) => {
        let i = acc.findIndex((ticket) => ticket.year === obj.year);
        if (i !== -1) {
          acc[i].cost += obj.cost;
        } else {
          acc.push({ year: obj.year, cost: obj.cost });
        }
        return acc;
      }, []);

      yearlyCosts.sort((a, b) => a.year - b.year);

      const totalCost = yearlyCosts.reduce((acc, year) => {
        return acc + Number(year.cost);
      }, 0);

      return (
        <div
          className="overview-card tickets-overview-card"
          style={{ gridRowEnd: totalCost > 0 ? "span 14" : "span 5" }}
        >
          <b>Tickets Overview</b>
          <p></p>
          Total cost: {totalCost.toFixed(2)}
          <br />
          {yearlyCosts && (
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: yearlyCosts.map((obj: TicketCost) => obj.year.toString()),
                },
              ]}
              series={[{ data: yearlyCosts.map((obj: TicketCost) => obj.cost) }]}
              height={200}
              margin={{ top: 20 }}
              grid={{ vertical: false, horizontal: true }}
            />
          )}
        </div>
      );
    } else {
      return (
        <div className="overview-card tickets-overview-card" style={{ gridRowEnd: "span 5" }}>
          <b>Tickets Overview</b>
          <p></p>
          Add more data to get an overview.
        </div>
      );
    }
  } else {
    return (
      <div className="overview-card tickets-overview-card" style={{ gridRowEnd: "span 5" }}>
        <b>Tickets Overview</b>
        <p></p>
        Add a vehicle first.
      </div>
    );
  }
}
