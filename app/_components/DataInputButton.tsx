import { ButtonBase } from "@mui/material";

type DataInputButtonProps = {
  name: string;
  clickAction: () => void;
};

export function DataInputButton({
  name: Name,
  clickAction: ClickAction,
}: DataInputButtonProps) {
  return (
    <button className="button add-data-button" onClick={() => ClickAction()}>
      <b>
        Add
        <br />
        {Name}
      </b>
    </button>
  );
}
