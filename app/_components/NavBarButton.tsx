import React from "react";
import { SvgIconComponent } from "@mui/icons-material";
import { capitalizeFirstLetter } from "./Utils";

type NavBarButtonProps = {
  icon: SvgIconComponent;
  text: string;
  clickAction: () => void;
  selected: boolean;
};

export function NavBarButton({
  icon: ItemIcon,
  text: Title,
  clickAction: ClickAction,
  selected = false,
}: NavBarButtonProps) {
  return (
    <>
      <button onClick={ClickAction} id={selected ? "selected" : ""}>
        <ItemIcon />
        &ensp; {capitalizeFirstLetter(Title)}
      </button>
    </>
  );
}
