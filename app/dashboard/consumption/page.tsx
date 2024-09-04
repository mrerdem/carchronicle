"use client";
import React, { useState } from "react";
import { VehicleSelector } from "@/app/_components/VehicleSelector";
import { DataInputButton } from "@/app/_components/DataInputButton";
import { DataCard } from "@/app/_components/cards/DataCard";
import { REFILL_INFO_PRINTED } from "@/app/constants";
import { ConsumptionOverviewCard } from "@/app/_components/cards/ConsumptionOverviewCard";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { selectActiveVehicleData, updateActiveVehicleData } from "@/app/_redux/features/vehicleData/vehicleDataSlice";
import RefillDataForm from "@/app/_components/forms/RefillDataForm";
import { createClient } from "@/app/_supabase/client";

export default function Consumption() {
  const [dataToEdit, setDataToEdit] = useState<RefillData>(null);
  const activeVehicleData = useAppSelector(selectActiveVehicleData);
  const dispatch = useAppDispatch();

  const [refillFormVisibility, setRefillFormVisibility] = useState(false);

  const openRefillForm = () => {
    setRefillFormVisibility(true);
  };

  const closeRefillForm = () => {
    setRefillFormVisibility(false);
    setDataToEdit(null);
  };

  const handleCardClick = (row: number) => {
    setDataToEdit(activeVehicleData.refill_data.find((data) => data.row === row));
    openRefillForm();
  };

  const handleRefillFormSubmit = async (task: string, user_id: string, formData: RefillData) => {
    const supabase = createClient();
    if (task === "add") {
      try {
        const { data, error } = await supabase.rpc("add_refill_data", {
          data: { ...formData, vehicle_row: activeVehicleData.row, user_id: user_id },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (data.avgConsumption != null) {
              updatedVehicleData.avg_consumption = data.avgConsumption;
            }
            if (updatedVehicleData.refill_data) {
              updatedVehicleData.refill_data.push({
                ...formData,
                row: data.row,
              });
            } else {
              updatedVehicleData.refill_data = [
                {
                  ...formData,
                  row: data.row,
                },
              ];
            }
            dispatch(updateActiveVehicleData(updatedVehicleData));
            closeRefillForm();
          }
        } else {
          throw new Error("API response failed");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (task === "update") {
      try {
        const { data, error } = await supabase.rpc("update_refill_data", {
          data: { ...formData, user_id: user_id, vehicle_row: activeVehicleData.row },
        });

        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (data.avgConsumption != null) {
              updatedVehicleData.avg_consumption = data.avgConsumption;
            }
            if (updatedVehicleData.refill_data) {
              const indexToUpdate = updatedVehicleData.refill_data.findIndex((data) => data.row === data.row);
              if (indexToUpdate != null) {
                updatedVehicleData.refill_data[indexToUpdate] = formData;
              }
            }
            dispatch(updateActiveVehicleData(updatedVehicleData));
            closeRefillForm();
          }
        } else {
          throw new Error("API response failed");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (task === "delete") {
      try {
        const { data, error } = await supabase.rpc("delete_refill_data", {
          data: { ...formData, user_id: user_id, vehicle_row: activeVehicleData.row },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (data.avgConsumption != null) {
              updatedVehicleData.avg_consumption = data.avgConsumption;
            }
            if (updatedVehicleData.refill_data) {
              const indexToDelete = updatedVehicleData.refill_data.findIndex((data) => data.row === data.row);
              if (indexToDelete != null) {
                updatedVehicleData.refill_data.splice(indexToDelete, 1);
              }
            }
            dispatch(updateActiveVehicleData(updatedVehicleData));
            closeRefillForm();
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
          {activeVehicleData && <DataInputButton name={"refill data"} clickAction={openRefillForm}></DataInputButton>}
        </div>
      )}
      <div className="card-container">
        <RefillDataForm
          open={refillFormVisibility}
          onSubmit={handleRefillFormSubmit}
          onClose={closeRefillForm}
          existingFormData={dataToEdit}
        ></RefillDataForm>
        {ConsumptionOverviewCard(activeVehicleData)}
        {activeVehicleData?.refill_data && activeVehicleData.avg_consumption != null && (
          <>
            {activeVehicleData.refill_data.map((data, index) =>
              DataCard(index + 1, "Refill data", data, REFILL_INFO_PRINTED, handleCardClick)
            )}
          </>
        )}
      </div>
    </div>
  );
}
