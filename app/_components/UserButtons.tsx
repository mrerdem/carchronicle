import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";

type UserButtonProps = {
  render: boolean;
  clickAction: React.MouseEventHandler<HTMLButtonElement>;
  menuStatus: boolean;
};

export function UserAccountButton({ render, clickAction, menuStatus }: UserButtonProps) {
  return (
    render && (
      <button className="button header-button" id="user-account-button" onClick={clickAction}>
        {menuStatus ? <CloseIcon /> : <AccountCircleIcon />}
      </button>
    )
  );
}

export function UserLoginButton({ render, clickAction }: UserButtonProps) {
  return (
    render && (
      <button className="button header-button" id="user-login-button" onClick={clickAction}>
        Login
      </button>
    )
  );
}

export function UserRegisterButton({ render, clickAction }: UserButtonProps) {
  return (
    render && (
      <button className="button header-button" id="user-register-button" onClick={clickAction}>
        Register
      </button>
    )
  );
}

export function UserLogoutButton({ render, clickAction }: UserButtonProps) {
  return (
    render && (
      <button className="button header-button" id="user-logout-button" onClick={clickAction}>
        Logout
      </button>
    )
  );
}

export function CancelButton({ render, clickAction: clickAction }: UserButtonProps) {
  return (
    render && (
      <button className="button" id="cancel-button" onClick={clickAction}>
        Cancel
      </button>
    )
  );
}
