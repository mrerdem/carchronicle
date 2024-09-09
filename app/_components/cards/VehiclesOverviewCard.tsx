import { VEHICLE_TYPES } from "@/app/constants";

export function VehiclesOverviewCard(data: VehicleData[]) {
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

    let rowNum = 5;
    rowNum += activeVehicleNumbers.filter((number) => number > 0).length ? 2 : 0;
    rowNum += activeVehicleNumbers.reduce((sum, number) => {
      return number > 0 ? sum + 1 : sum;
    }, 0);
    rowNum += soldVehicleNumbers.filter((number) => number > 0).length ? 2 : 0;
    rowNum += soldVehicleNumbers.reduce((sum, number) => {
      return number > 0 ? sum + 1 : sum;
    }, 0);

    return (
      <div
        className="card overview-card vehicles-overview-card"
        style={{
          gridRowEnd: "span " + rowNum,
        }}
      >
        <div className="card-title">Vehicles Overview</div>
        <br />
        <div>
          <div>All vehicles ({data.length} total):</div>
          <ul>
            {activeVehicles.length > 0 && (
              <>
                <br />
                <li>Active vehicles ({activeVehicles.length} total):</li>
                <ul>
                  {VEHICLE_TYPES.map(
                    (type, index) =>
                      activeVehicleNumbers[index] > 0 && (
                        <li key={index}>
                          {activeVehicleNumbers[index] +
                            " " +
                            type.toLowerCase() +
                            (activeVehicleNumbers[index] > 1 ? "s" : "")}
                        </li>
                      )
                  )}
                </ul>
              </>
            )}
            {soldVehicles.length > 0 && (
              <>
                <br />
                <li>Sold vehicles ({soldVehicles.length} total):</li>
                <ul>
                  {VEHICLE_TYPES.map(
                    (type, index) =>
                      soldVehicleNumbers[index] > 0 && (
                        <li key={index}>
                          {soldVehicleNumbers[index] +
                            " " +
                            type.toLowerCase() +
                            (soldVehicleNumbers[index] > 1 ? "s" : "")}
                        </li>
                      )
                  )}
                </ul>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div className="card overview-card vehicles-overview-card" style={{ gridRowEnd: "span 5" }}>
        <div className="card-title">Vehicles Overview</div>
        <p></p>
        <div className="card-text">Add a vehicle to get an overview.</div>
      </div>
    );
  }
}
