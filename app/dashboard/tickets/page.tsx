"use client";
import React, { useState } from "react";
import { VehicleSelector } from "@/app/_components/VehicleSelector";
import { DataInputButton } from "@/app/_components/DataInputButton";
import { TICKET_INFO_PRINTED } from "@/app/constants";
import { DataCard } from "@/app/_components/cards/DataCard";
import { TicketsOverviewCard } from "@/app/_components/cards/TicketsOverviewCard";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import {
  getVehicleDetails,
  selectActiveVehicleData,
  updateActiveVehicleData,
} from "@/app/_redux/features/vehicleData/vehicleDataSlice";
import TicketDataForm from "@/app/_components/forms/TicketDataForm";
import { createClient } from "@/app/_supabase/client";

export default function Tickets() {
  const [dataToEdit, setDataToEdit] = useState<TicketData>(null);
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
    setDataToEdit(activeVehicleData.ticket_data.find((data) => data.row === row));
    openForm();
  };

  const handleTicketFormSubmit = async (task: string, user_id: string, formData: TicketData) => {
    const supabase = createClient();
    if (task === "add") {
      try {
        const { data, error } = await supabase.rpc("add_ticket_data", {
          data: { ...formData, vehicle_row: activeVehicleData.row, user_id: user_id },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (updatedVehicleData.ticket_data) {
              updatedVehicleData.ticket_data.push({
                ...formData,
                row: data.row,
              });
            } else {
              updatedVehicleData.ticket_data = [
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
        const { data, error } = await supabase.rpc("update_ticket_data", {
          data: { ...formData, user_id: user_id, vehicle_row: activeVehicleData.row },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (updatedVehicleData.ticket_data) {
              const indexToUpdate = updatedVehicleData.ticket_data.findIndex((data) => data.row === data.row);
              if (indexToUpdate != null) {
                updatedVehicleData.ticket_data[indexToUpdate] = formData;
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
        const { data, error } = await supabase.rpc("delete_ticket_data", {
          data: { ...formData, user_id: user_id, vehicle_row: activeVehicleData.row },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (updatedVehicleData.ticket_data) {
              const indexToDelete = updatedVehicleData.ticket_data.findIndex((data) => data.row === data.row);
              if (indexToDelete != null) {
                updatedVehicleData.ticket_data.splice(indexToDelete, 1);
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
          <DataInputButton name={"ticket"} clickAction={openForm}></DataInputButton>
        </div>
      )}
      <div className="card-container">
        <TicketDataForm
          open={formVisibility}
          onSubmit={handleTicketFormSubmit}
          onClose={closeForm}
          existingFormData={dataToEdit}
        ></TicketDataForm>
        {TicketsOverviewCard(activeVehicleData)}
        {activeVehicleData?.ticket_data && (
          <>
            {activeVehicleData.ticket_data.map((data, index) =>
              DataCard(index + 1, "Ticket", data, TICKET_INFO_PRINTED, editForm)
            )}
          </>
        )}
      </div>
    </div>
  );
}
