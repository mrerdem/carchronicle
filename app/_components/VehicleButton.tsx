import React from "react";
import { ButtonBase } from "@mui/material";

type VehicleButtonProps = {
  make: string;
  model: string;
  index: number;
  clickAction: (index: number) => void;
  selected: boolean;
};

export function VehicleButton({
  make: Make,
  model: Model,
  index: Index,
  clickAction: ClickAction,
  selected = false,
}: VehicleButtonProps) {
  return (
    <ButtonBase
      onClick={() => ClickAction(Index)}
      id={selected ? "selected" : ""}
    >
      {Make}
      <br />
      {Model}
    </ButtonBase>
  );
}
