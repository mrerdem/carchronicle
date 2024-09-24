"use client";
import { setSessionData } from "@/app/_redux/features/session/sessionDataSlice";
import { selectUiData, setUiData } from "@/app/_redux/features/ui/uiDataSlice";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { GoogleSigninReponse, signinWithGoogle } from "@/app/_supabase/actions";
import { useEffect } from "react";

declare global {
  interface Window {
    handleSignInWithGoogle: (response: GoogleSigninReponse) => void;
  }
}

export function GoogleLoginButton() {
  const uiData = useAppSelector(selectUiData);
  const dispatch = useAppDispatch();

  async function handleSignInWithGoogle(response: GoogleSigninReponse) {
    const resp = await signinWithGoogle(response);

    if (resp.error) {
      dispatch(setSessionData({ email: "", id: "" }));
    } else {
      if (resp.data.session?.access_token) {
        dispatch(setUiData({ ...uiData, loginFormVisibility: false }));
        dispatch(setSessionData({ email: resp.data.user.email, id: resp.data.user.id }));
      } else {
        dispatch(setSessionData({ email: "", id: "" }));
      }
    }
  }

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  window.handleSignInWithGoogle = handleSignInWithGoogle; // data-callback is a string, so we need this

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID}
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        data-auto_prompt="false"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="outline"
        data-text="continue_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </>
  );
}
