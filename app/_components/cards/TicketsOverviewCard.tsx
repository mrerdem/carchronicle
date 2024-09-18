import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";
import { useAppSelector } from "@/app/_redux/hooks";
import { BarChart } from "@mui/x-charts/BarChart";
import { getCoef } from "../Utils";

export function TicketsOverviewCard(data: VehicleData | null) {
  const userPrefs = useAppSelector(selectUserPrefs);

  if (data != null) {
    const style = getComputedStyle(document.body);

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

      // Calculate short representation coefficient (for left margin conformation)
      const plotCoef = getCoef(
        yearlyCosts.reduce((max, data) => {
          return data.cost > max ? (max = data.cost) : (max = max);
        }, 0)
      );

      return (
        <div
          className="card overview-card tickets-overview-card"
          style={{ gridRowEnd: totalCost > 0 ? "span 16" : "span 5" }}
        >
          <div className="card-title">Tickets Overview</div>
          <br />
          <div className="card-text">
            <div style={{ display: "flex" }}>
              <div>Total cost:</div>
              <div className="card-dotfill"></div>
              <div>
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: userPrefs.currency,
                }).format(totalCost)}
              </div>
            </div>
          </div>
          {yearlyCosts && (
            <>
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
                    scaleType: "band",
                    data: yearlyCosts.map((obj: TicketCost) => obj.year.toString()),
                  },
                ]}
                series={[{ data: yearlyCosts.map((obj: TicketCost) => obj.cost / plotCoef) }]}
                colors={[style.getPropertyValue("--color-7")]}
                height={200}
                margin={{ top: 20, left: 30, right: 4, bottom: 39 }} // 4: x-label is eaten on mobile with 0, 39: bold stroke bug with 40
                grid={{ vertical: false, horizontal: true }}
                sx={{ "&&": { touchAction: "auto" } }}
              />
            </>
          )}
        </div>
      );
    } else {
      return (
        <div className="card overview-card tickets-overview-card" style={{ gridRowEnd: "span 5" }}>
          <div className="card-title">Tickets Overview</div>
          <p></p>
          <div className="card-text">No tickets.</div>
        </div>
      );
    }
  } else {
    return (
      <div className="card overview-card tickets-overview-card" style={{ gridRowEnd: "span 5" }}>
        <div className="card-title">Tickets Overview</div>
        <p></p>
        <div className="card-text">Add a vehicle first.</div>
      </div>
    );
  }
}
