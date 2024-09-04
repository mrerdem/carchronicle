import React from "react";
import { SvgIconComponent } from "@mui/icons-material";

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
        &ensp; {Title.charAt(0).toUpperCase() + Title.slice(1)}
      </button>
    </>
  );
}
