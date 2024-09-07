"use client";

import { useState, useEffect } from "react";
import {
  UserAccountButton,
  UserLoginButton,
  UserRegisterButton,
  UserLogoutButton,
} from "@/app/_components/UserButtons";
import { UserLoginForm, UserRegisterForm } from "@/app/_components/UserForms";
import { useRouter, usePathname } from "next/navigation";
import { resetSessionData, selectSessionData, setSessionData } from "@/app/_redux/features/session/sessionDataSlice";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import {
  resetAllVehicleData,
  selectFetchVehicleListStatus,
  selectVehicleData,
} from "@/app/_redux/features/vehicleData/vehicleDataSlice";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { selectUiData, setUiData } from "@/app/_redux/features/ui/uiDataSlice";
import { signout } from "@/app/_supabase/actions";
import { createClient } from "@/app/_supabase/client";

type HeaderProps = {
  navBarState: boolean;
  setNavBarState: (status: boolean) => void;
};

export function Header({ navBarState, setNavBarState }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const sessionData = useAppSelector(selectSessionData);
  const vehicleData = useAppSelector(selectVehicleData);
  const uiData = useAppSelector(selectUiData);
  const fetchVehicleListStatus = useAppSelector(selectFetchVehicleListStatus);
  const MOBILE_WIDTH = 768;

  const [state, setState] = useState({
    mobileLayout: false,
    userMenuStatus: false, // User menu is visible or not
    loginFormStatus: false, // Login form is visible or not
    registerFormStatus: false, // Register form is visible or not
    userLoginStatus: false, // User logged-in or not
  });

  const handleUserAccountButtonClick = () => {
    setState((prevState) => ({
      ...prevState,
      userMenuStatus: !prevState.userMenuStatus,
      loginFormStatus: false,
      registerFormStatus: false,
    }));
  };

  const handleLoginButtonAction = () => {
    // Make form visible for user information
    setState((prevState) => ({
      ...prevState,
      loginFormStatus: true,
      userMenuStatus: true,
    }));
  };

  const handleRegisterButtonAction = () => {
    // Make form visible for user information
    setState((prevState) => ({
      ...prevState,
      registerFormStatus: true,
      userMenuStatus: true,
    }));
  };

  const handleLogoutButtonAction = async () => {
    const response = await signout();
    if (!response.error) {
      localStorage.clear();
      dispatch(resetSessionData());
      dispatch(resetAllVehicleData());

      setState((prevState) => ({
        ...prevState,
        userMenuStatus: false,
      }));
      router.push("/");
    }
  };

  const handleCancelButtonAction = () => {
    setState((prevState) => ({
      ...prevState,
      loginFormStatus: false,
      registerFormStatus: false,
      userMenuStatus: true,
    }));
  };

  const handleResize = () => {
    // Update mobileLayout state based on the new window size
    setState((prevState) => ({
      ...prevState,
      mobileLayout: window.innerWidth <= MOBILE_WIDTH,
    }));
  };

  // Restore session from local storage
  const getSession = async () => {
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    if (!user.error) {
      dispatch(setSessionData({ email: user.data.user.email, id: user.data.user.id }));
    }
  };

  useEffect(() => {
    // Set initial mobileLayout state
    handleResize();

    // Add listener when component is mounted for future layout changes
    window.addEventListener("resize", handleResize);

    getSession();

    // Remove listener when component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Dispatch changes to slice
  useEffect(() => {
    dispatch(setUiData({ ...uiData, mobileLayout: state.mobileLayout }));
  }, [state.mobileLayout]);

  // Re-direct all navigation to home page if not logged in
  useEffect(() => {}, [pathname]);

  // If no vehicles owned, redirect to vehicles page
  useEffect(() => {
    if (fetchVehicleListStatus === "idle") {
      if (vehicleData.length === 0) {
        router.push("/dashboard/vehicles");
      }
    }
  }, [fetchVehicleListStatus]);

  // Hide login/register forms after token is received
  useEffect(() => {
    if (sessionData.id) {
      setState((prevState) => ({
        ...prevState,
        loginFormStatus: false,
        registerFormStatus: false,
        userLoginStatus: true,
      }));
      // Redirect to dashboard if URL is manually changed to homepage
      if (pathname === "/") {
        router.push("/dashboard");
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        userLoginStatus: false,
      }));
    }
  }, [sessionData.id]);

  const navTitle = pathname.split("/")[pathname.split("/").length - 1];

  return (
    <div className="header">
      <div
        className="logo desktop-logo"
        style={{ display: !state.mobileLayout && !state.userLoginStatus ? "flex" : "none" }}
      >
        <p>
          CarChronicle<sup>beta</sup>
        </p>
      </div>

      <div className="expanding-space"></div>

      <div className="mobile-header-container">
        <div
          className="logo mobile-logo"
          style={{ display: state.mobileLayout && !state.userLoginStatus ? "block" : "none" }}
        >
          <p>
            CarChronicle<sup>beta</sup>
          </p>
        </div>
        <button
          className="button header-button"
          onClick={() => setNavBarState(!navBarState)}
          style={{ display: state.mobileLayout && state.userLoginStatus ? "block" : "none" }}
        >
          {navBarState ? <CloseIcon /> : <MenuIcon />}
        </button>
        <div className="route-label" style={{ display: state.mobileLayout && state.userLoginStatus ? "flex" : "none" }}>
          <p>{navTitle.charAt(0).toUpperCase() + navTitle.slice(1)}</p>
        </div>
        <div className="expanding-space"></div>
        <UserAccountButton
          render={state.mobileLayout}
          clickAction={handleUserAccountButtonClick}
          menuStatus={state.userMenuStatus}
        />
      </div>

      <UserLoginForm render={state.loginFormStatus && state.userMenuStatus} cancelAction={handleCancelButtonAction} />

      <UserRegisterForm
        render={state.registerFormStatus && state.userMenuStatus}
        cancelAction={handleCancelButtonAction}
      />

      <UserLoginButton
        render={
          (!state.mobileLayout && !state.userLoginStatus && !state.registerFormStatus && !state.loginFormStatus) ||
          (state.mobileLayout &&
            !state.userLoginStatus &&
            state.userMenuStatus &&
            !state.registerFormStatus &&
            !state.loginFormStatus)
        }
        clickAction={handleLoginButtonAction}
        menuStatus={state.userMenuStatus}
      />

      <UserRegisterButton
        render={
          (!state.mobileLayout && !state.userLoginStatus && !state.loginFormStatus && !state.registerFormStatus) ||
          (state.mobileLayout &&
            !state.userLoginStatus &&
            state.userMenuStatus &&
            !state.loginFormStatus &&
            !state.registerFormStatus)
        }
        clickAction={handleRegisterButtonAction}
        menuStatus={state.userMenuStatus}
      />

      <UserLogoutButton
        render={
          (!state.mobileLayout && state.userLoginStatus) ||
          (state.mobileLayout && state.userMenuStatus && state.userLoginStatus)
        }
        clickAction={handleLogoutButtonAction}
        menuStatus={state.userMenuStatus}
      />
    </div>
  );
}
