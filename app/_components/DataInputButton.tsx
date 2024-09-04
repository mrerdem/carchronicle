import { ButtonBase } from "@mui/material";

type DataInputButtonProps = {
  name: string;
  clickAction: () => void;
};

export function DataInputButton({ name: Name, clickAction: ClickAction }: DataInputButtonProps) {
  return (
    <ButtonBase className="add-data-button" onClick={() => ClickAction()}>
      <b>Add {Name}</b>
    </ButtonBase>
  );
}
