import { useRef, useState } from "react";
import { login, signup } from "../_supabase/actions";
import { useAppDispatch } from "../_redux/hooks";
import { setSessionData } from "../_redux/features/session/sessionDataSlice";
import { useRouter } from "next/navigation";

type FormComponentProps = {
  render: boolean;
  cancelAction: () => void;
};

export function UserLoginForm({ render: visibility, cancelAction }: FormComponentProps) {
  const [errorValue, setErrorValue] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loginFormRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload

    if (loginFormRef.current) {
      const formData = new FormData(loginFormRef.current);
      const response = await login(formData);

      if (response.error) {
        setErrorValue(response.error.message);
      } else {
        if (response.data.session?.access_token) {
          setErrorValue("");
          dispatch(
            setSessionData({
              email: response.data.user.email,
              id: response.data.user.id,
            })
          );
          router.push("/dashboard");
        } else {
            setErrorValue(response.error.message);
        }
      }
    }
  };

  const handleCancel = () => {
    setErrorValue("");
    cancelAction();
  }

  return (
    visibility && (
      <form className="form login-form" ref={loginFormRef} onSubmit={handleSubmit}>
        <label className="label login-error-label">{errorValue}</label>
        <input className="input header-input" id="email" type="email" name="email" placeholder="e-mail" required />
        <input
          className="input header-input"
          id="password"
          type="password"
          name="password"
          placeholder="password"
          required
        />
        <button className="button header-button" id="user-login-button" type="submit">
          Submit
        </button>
        <button className="button header-button" id="user-cancel-button" type="submit" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    )
  );
}

export function UserRegisterForm({ render: isVisible, cancelAction }: FormComponentProps) {
  const [errorValue, setErrorValue] = useState("");
  const registerFormRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload

    if (registerFormRef.current) {
      const formData = new FormData(registerFormRef.current);
      const response = await signup(formData);

      if (response.error) {
          setErrorValue(response.error.message);
      } else {
        if (response.data.user && !response.data.session) {
            setErrorValue("Check your e-mail");
        }
      }
    }
  };

  const handleCancel = () => {
    setErrorValue("");
    cancelAction();
  }

  return (
    isVisible && (
      <form className="form register-form" ref={registerFormRef} onSubmit={handleSubmit}>
        <label className="label login-error-label">{errorValue}</label>
        <input className="input header-input" id="email" type="email" name="email" placeholder="e-mail" required />
        <input
          className="input header-input"
          id="password"
          type="password"
          name="password"
          placeholder="password"
          required
        />
        <button className="button header-button" id="user-register-button" type="submit">
          Submit
        </button>
        <button className="button header-button" id="user-cancel-button" type="submit" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    )
  );
}
