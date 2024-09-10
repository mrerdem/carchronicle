import { VEHICLE_TYPES } from "@/app/constants";

export function VehiclesOverviewCard(data: VehicleData[], rowSpan: number | null) {
  if (data?.length > 0) {
    const activeVehicles = data.filter((vehicle) => !vehicle.sell_date && !vehicle.sell_price);
    const soldVehicles = data.filter((vehicle) => vehicle.sell_date || vehicle.sell_price);

    const activeVehicleNumbers = VEHICLE_TYPES.map((type) => {
      return activeVehicles.reduce((num, vehicle) => {
        return vehicle.type === type ? num + 1 : num;
      }, 0);
    });

    const soldVehicleNumbers = VEHICLE_TYPES.map((type) => {
      return soldVehicles.reduce((num, vehicle) => {
        return vehicle.type === type ? num + 1 : num;
      }, 0);
    });

    return (
      <div
        className="card overview-card vehicles-overview-card"
        style={{
          gridRowEnd: "span " + rowSpan,
        }}
      >
        <div className="card-title" row-num="2">
          Vehicles Overview
        </div>
        <br />
        <div className="card-text">
          <div row-num="1">All vehicles ({data.length} total):</div>
          <ul>
            {activeVehicles.length > 0 && (
              <div
                row-num={
                  activeVehicleNumbers.reduce((sum, number) => {
                    return number ? sum + 1 : sum;
                  }, 0) + 2
                }
              >
                <br />
                <li>Active vehicles ({activeVehicles.length} total):</li>
                <ul>
                  {VEHICLE_TYPES.map(
                    (type, index) =>
                      activeVehicleNumbers[index] > 0 && (
                        <li key={index}>
                          {activeVehicleNumbers[index] + " " + type + (activeVehicleNumbers[index] > 1 ? "s" : "")}
                        </li>
                      )
                  )}
                </ul>
              </div>
            )}
            {soldVehicles.length > 0 && (
              <div
                row-num={
                  soldVehicleNumbers.reduce((sum, number) => {
                    return number ? sum + 1 : sum;
                  }, 0) + 2
                }
              >
                <br />
                <li>Sold vehicles ({soldVehicles.length} total):</li>
                <ul>
                  {VEHICLE_TYPES.map(
                    (type, index) =>
                      soldVehicleNumbers[index] > 0 && (
                        <li key={index}>
                          {soldVehicleNumbers[index] + " " + type + (soldVehicleNumbers[index] > 1 ? "s" : "")}
                        </li>
                      )
                  )}
                </ul>
              </div>
            )}
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div className="card overview-card vehicles-overview-card" style={{ gridRowEnd: "span 5" }}>
        <div className="card-title" row-num="2">
          Vehicles Overview
        </div>
        <br />
        <div className="card-text" row-num="1">
          Add a vehicle to get an overview.
        </div>
      </div>
    );
  }
}
