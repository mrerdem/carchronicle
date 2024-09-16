"use client";

import { Header } from "@/app/_components/Header";
import NavBar from "@/app/_components/NavBar";
import { selectSessionData } from "@/app/_redux/features/session/sessionDataSlice";
import { selectUiData, setUiData } from "@/app/_redux/features/ui/uiDataSlice";
import {
  activateVehicleByIndex,
  getVehicleDetails,
  getVehicleList,
  selectActiveVehicleIndex,
  selectVehicleData,
} from "@/app/_redux/features/vehicleData/vehicleDataSlice";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { useEffect, useState } from "react";
import {
  getUserPrefs,
  selectUserPrefs,
  selectUserPrefsFetchState,
  setUserPrefs,
} from "../_redux/features/userPrefs/userPrefsSlice";
import UserPrefsForm from "../_components/forms/UserPrefsForm";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const vehicleData = useAppSelector(selectVehicleData);
  const sessionData = useAppSelector(selectSessionData);
  const userPrefs = useAppSelector(selectUserPrefs);
  const userPrefsFetchState = useAppSelector(selectUserPrefsFetchState);
  const uiData = useAppSelector(selectUiData);
  const activeVehicleIndex = useAppSelector(selectActiveVehicleIndex);
  const dispatch = useAppDispatch();

  const [state, setState] = useState({
    loginStatus: false,
    navBarState: true,
  });

  // This effect runs only once when layout is mounted
  useEffect(() => {
    // Fetch user preferences if empty
    if (!userPrefs) {
      dispatch(getUserPrefs());
    }
    // Fetch vehicle list
    if (vehicleData?.length === 0 && sessionData.id) {
      dispatch(getVehicleList());
    }
  }, []);

  // Show/hide user prefs form after prefs are fetched
  useEffect(() => {
    if (userPrefsFetchState === "idle" && !userPrefs) {
      dispatch(setUiData({ ...uiData, userPrefsFormVisibility: true }));
    } else {
      dispatch(setUiData({ ...uiData, userPrefsFormVisibility: false }));
    }
  }, [userPrefsFetchState]);

  useEffect(() => {
    if (vehicleData?.length && activeVehicleIndex < 0) {
      dispatch(activateVehicleByIndex(0));
    }
    // Fetch details of vehicles in the list if not fetched before
    if (vehicleData?.length) {
      vehicleData.map((vehicle) => {
        if (!vehicle.details) {
          dispatch(getVehicleDetails({ user_id: sessionData.id, row: vehicle.row }));
        }
      });
    }
  }, [vehicleData]);

  useEffect(() => {
    if (sessionData.id) {
      setState((prevState) => ({
        ...prevState,
        loginStatus: true,
      }));
      if (vehicleData?.length === 0) {
        dispatch(getVehicleList());
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        loginStatus: false,
      }));
    }
  }, [sessionData.id]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      navBarState: !uiData.mobileLayout,
    }));
  }, [uiData.mobileLayout]);

  const closeNavBar = () => {
    setState((prevState) => ({ ...prevState, navBarState: false }));
  };

  const setNavBarState = (state: boolean) => {
    setState((prevState) => ({ ...prevState, navBarState: state }));
  };

  const closeUserPrefsForm = () => {
    dispatch(setUiData({ ...uiData, userPrefsFormVisibility: false }));
  };

  const handleUserPrefsFormSubmit = async (user_id: string, userPrefs: UserPrefs) => {
    dispatch(setUserPrefs({ user_id: user_id, data: userPrefs }));
    closeUserPrefsForm();
  };

  return (
    <>
      <NavBar isVisible={state.navBarState} closeNavBar={closeNavBar} />
      <div className="dashboard-container">
        <Header setNavBarState={setNavBarState} navBarState={state.navBarState} />
        <UserPrefsForm
          open={uiData.userPrefsFormVisibility}
          onSubmit={handleUserPrefsFormSubmit}
          onClose={closeUserPrefsForm}
          existingFormData={userPrefs}
          cancellable={userPrefs != null}
        ></UserPrefsForm>

        {children}
      </div>
    </>
  );
}
