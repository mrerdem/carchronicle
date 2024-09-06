"use client";
import React, { useState } from "react";
import { VehicleSelector } from "@/app/_components/VehicleSelector";
import { DataInputButton } from "@/app/_components/DataInputButton";
import { ACCIDENT_INFO_PRINTED } from "@/app/constants";
import { DataCard } from "@/app/_components/cards/DataCard";
import { AccidentsOverviewCard } from "@/app/_components/cards/AccidentsOverviewCard";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import AccidentDataForm from "@/app/_components/forms/AccidentDataForm";
import {
  getVehicleDetails,
  selectActiveVehicleData,
  updateActiveVehicleData,
} from "@/app/_redux/features/vehicleData/vehicleDataSlice";
import { createClient } from "@/app/_supabase/client";

export default function Accidents() {
  const [dataToEdit, setDataToEdit] = useState<AccidentData>(null);
  const activeVehicleData = useAppSelector(selectActiveVehicleData);
  const [formVisibility, setFormVisibility] = useState(false);
  const dispatch = useAppDispatch();

  const openForm = () => {
    setFormVisibility(true);
  };

  const closeForm = () => {
    setFormVisibility(false);
    setDataToEdit(null);
  };

  const editForm = (row: number) => {
    setDataToEdit(activeVehicleData.accident_data.find((data) => data.row === row));
    openForm();
  };

  const handleTicketFormSubmit = async (task: string, user_id: string, formData: AccidentData) => {
    const supabase = createClient();
    if (task === "add") {
      try {
        const { data, error } = await supabase.rpc("add_accident_data", {
          data: { ...formData, vehicle_row: activeVehicleData.row, user_id: user_id },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (updatedVehicleData.accident_data) {
              updatedVehicleData.accident_data.push({
                ...formData,
                row: data.row,
              });
            } else {
              updatedVehicleData.accident_data = [
                {
                  ...formData,
                  row: data.row,
                },
              ];
            }
            dispatch(getVehicleDetails({ user_id: user_id, row: activeVehicleData.row }));
            closeForm();
          }
        } else {
          throw new Error("API response failed");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (task === "update") {
      try {
        const { data, error } = await supabase.rpc("update_accident_data", {
          data: { ...formData, user_id: user_id, vehicle_row: activeVehicleData.row },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (updatedVehicleData.accident_data) {
              const indexToUpdate = updatedVehicleData.accident_data.findIndex((accident) => accident.row === data.row);
              if (indexToUpdate != null) {
                updatedVehicleData.accident_data[indexToUpdate] = formData;
              }
            }
            dispatch(updateActiveVehicleData(updatedVehicleData));
            closeForm();
          }
        } else {
          throw new Error("API response failed");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (task === "delete") {
      try {
        const { data, error } = await supabase.rpc("delete_accident_data", {
          data: { ...formData, user_id: user_id, vehicle_row: activeVehicleData.row },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (updatedVehicleData.accident_data) {
              const indexToDelete = updatedVehicleData.accident_data.findIndex((accident) => accident.row === data.row);
              if (indexToDelete != null) {
                updatedVehicleData.accident_data.splice(indexToDelete, 1);
              }
            }
            dispatch(updateActiveVehicleData(updatedVehicleData));
            closeForm();
          }
        } else {
          throw new Error("API response failed");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <div className="data-container">
      {activeVehicleData && (
        <div className="options-container">
          <VehicleSelector />
          <DataInputButton name={"accident data"} clickAction={openForm}></DataInputButton>
        </div>
      )}
      <div className="card-container">
        <AccidentDataForm
          open={formVisibility}
          onSubmit={handleTicketFormSubmit}
          onClose={closeForm}
          existingFormData={dataToEdit}
        ></AccidentDataForm>
        {AccidentsOverviewCard(activeVehicleData)}
        {activeVehicleData?.accident_data && (
          <>
            {activeVehicleData.accident_data.map((data, index) =>
              DataCard(index + 1, "Accident data", data, ACCIDENT_INFO_PRINTED, editForm)
            )}
          </>
        )}
      </div>
    </div>
  );
}
