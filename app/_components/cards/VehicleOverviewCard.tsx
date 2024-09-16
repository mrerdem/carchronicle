import { VEHICLE_TYPES } from "@/app/constants";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { calcTotalCost } from "../Utils";
import { useAppSelector } from "@/app/_redux/hooks";
import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";
dayjs.extend(duration);

export function VehicleOverviewCard(data: VehicleData) {
  const userPrefs = useAppSelector(selectUserPrefs);

  if (data != null) {
    // Calculate ownership duration
    const duration = dayjs.duration(
      data.sell_date ? dayjs(data.sell_date).diff(dayjs(data.purchase_date)) : dayjs().diff(dayjs(data.purchase_date))
    );
    const durationMonths = duration.years() * 12 + duration.months();

    // Calculate ownership cost
    const cost = calcTotalCost(data);

    return (
      <div className="card overview-card vehicle-overview-card" style={{ gridRowEnd: "span 11" }}>
        <div className="card-title">Vehicle Overview</div>
        <br />
        <div className="card-text">
          <div style={{ display: "flex" }}>
            <div>Status:</div>
            <div className="card-dotfill"></div>
            <div>{data.sell_date === null && data.sell_price === null ? "Active" : "Sold"}</div>
          </div>
          <br />
          <div style={{ display: "flex" }}>
            <div>Time owned:</div>
            <div className="card-dotfill"></div>
            <div>
              {data.purchase_date != null
                ? duration.years() + " years, " + duration.months() + " months, " + duration.days() + " days"
                : "Purchase date unknown"}
            </div>
          </div>
          <br />
          <div style={{ display: "flex" }}>
            <div>Total cost:</div>
            <div className="card-dotfill"></div>
            <div>
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: userPrefs?.currency ? userPrefs.currency : "USD",
              }).format(cost)}
            </div>
          </div>
          <br />
          <div style={{ display: "flex" }}>
            <div>Monthly cost:</div>
            <div className="card-dotfill"></div>
            <div>
              {data.purchase_date != null
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: userPrefs?.currency ? userPrefs.currency : "USD",
                  }).format(durationMonths ? cost / durationMonths : 0)
                : "Purchase date unknown"}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="card overview-card vehicle-overview-card" style={{ gridRowEnd: "span 5" }}>
        <div className="card-title">Vehicle Overview</div>
        <br />
        <div className="card-text">Add a vehicle to get an overview.</div>
      </div>
    );
  }
}
