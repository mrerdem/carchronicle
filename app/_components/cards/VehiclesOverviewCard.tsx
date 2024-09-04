import { VEHICLE_TYPES } from "@/app/constants";

export function VehiclesOverviewCard(data: VehicleData[]) {
  const vehicleNumbers = VEHICLE_TYPES.map((type) => {
    return data.reduce((num, vehicle) => {
      return vehicle.type === type ? num + 1 : num;
    }, 0);
  });

  if (data?.length > 0) {
    return (
      <div
        className="overview-card vehicles-overview-card"
        style={{
          gridRowEnd:
            "span " +
            (vehicleNumbers.reduce((sum, number) => {
              return number > 0 ? sum + 1 : sum;
            }, 0) +
              5),
        }}
      >
        <b>Vehicles Overview</b>
        <p></p>
        <div>
          <>Total vehicles: {data.length}</>
          {VEHICLE_TYPES.map(
            (type, index) =>
              vehicleNumbers[index] > 0 && (
                <div key={index}>
                  {type}: {vehicleNumbers[index]}
                </div>
              )
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="overview-card vehicles-overview-card" style={{ gridRowEnd: "span 5" }}>
        <b>Vehicles Overview</b>
        <p></p>
        Add a vehicle first.
      </div>
    );
  }
}
