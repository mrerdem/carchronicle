"use client";
import { DataCard } from "@/app/_components/cards/DataCard";
import { DataInputButton } from "@/app/_components/DataInputButton";
import { VEHICLE_INFO_PRINTED } from "@/app/constants";
import React, { useState } from "react";
import {
  addVehicle,
  deleteVehicle,
  selectVehicleData,
  updateVehicle,
} from "@/app/_redux/features/vehicleData/vehicleDataSlice";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { selectSessionData } from "@/app/_redux/features/session/sessionDataSlice";
import VehicleDataForm from "@/app/_components/forms/VehicleDataForm";
import { OwnershipOverviewCard } from "@/app/_components/cards/OwnershipOverviewCard";
import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";

export default function Vehicles() {
  const [dataToEdit, setDataToEdit] = useState<VehicleData | null>(null);
  const vehicleData = useAppSelector(selectVehicleData);
  const dispatch = useAppDispatch();
  const sessionData = useAppSelector(selectSessionData);
  const userPrefs = useAppSelector(selectUserPrefs);
  const [vehicleFormVisibility, setVehicleFormVisibility] = useState(false);

  const openVehicleForm = () => {
    setVehicleFormVisibility(true);
  };

  const closeVehicleForm = () => {
    setVehicleFormVisibility(false);
    setDataToEdit(null);
  };

  const handleCardClick = (row: number) => {
    const data = vehicleData.find((data) => data.row === row);
    setDataToEdit(data || null);
    openVehicleForm();
  };

  const handleVehicleFormSubmit = async (task: string, vehicleFormData: VehicleData) => {
    if (task === "insert") {
      dispatch(addVehicle({ user_id: sessionData.id, data: vehicleFormData }));
      closeVehicleForm();
    } else if (task === "update") {
      dispatch(updateVehicle({ user_id: sessionData.id, data: vehicleFormData }));
      closeVehicleForm();
    } else if (task === "delete") {
      dispatch(deleteVehicle({ user_id: sessionData.id, row: vehicleFormData.row }));
      closeVehicleForm();
    }
  };

  return (
    vehicleData && (
      <div className="data-container">
        <div className="options-container">
          <div></div>
          <DataInputButton name={"vehicle"} clickAction={openVehicleForm}></DataInputButton>
        </div>
        <div className="card-container">
          <VehicleDataForm
            open={vehicleFormVisibility}
            onSubmit={handleVehicleFormSubmit}
            onClose={closeVehicleForm}
            existingFormData={dataToEdit}
            userPrefs={userPrefs}
          ></VehicleDataForm>
          {OwnershipOverviewCard(vehicleData)}
          {vehicleData.map((data, index) =>
            DataCard(index + 1, "Vehicle info", data, VEHICLE_INFO_PRINTED, userPrefs, handleCardClick)
          )}
        </div>
      </div>
    )
  );
}
