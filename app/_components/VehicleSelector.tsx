// Lists existing vehicles in a list for user to choose.
// Dispatches action to set active vehicle data.

import React from "react";
import { VehicleButton } from "@/app/_components/VehicleButton";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import {
  activateVehicleByIndex,
  selectActiveVehicleIndex,
  selectVehicleData,
} from "@/app/_redux/features/vehicleData/vehicleDataSlice";

export function VehicleSelector({}) {
  const activeVehicleIndex = useAppSelector(selectActiveVehicleIndex);
  const vehicleData = useAppSelector(selectVehicleData);
  const dispatch = useAppDispatch();

  function activateVehicle(index: number) {
    if (vehicleData[index]) {
      dispatch(activateVehicleByIndex(index));
    }
  }

  return (
    vehicleData && (
      <div key={"0"} className="vehicle-selector">
        {vehicleData.length
          ? vehicleData.map((vehicle: VehicleListItem, index) => (
              <VehicleButton
                make={vehicle.make}
                model={vehicle.model}
                index={index}
                key={vehicle.row}
                clickAction={activateVehicle}
                selected={index === activeVehicleIndex}
              />
            ))
          : null}
      </div>
    )
  );
}
