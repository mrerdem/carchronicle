"use client";

import { Header } from "@/app/_components/Header";
import NavBar from "@/app/_components/NavBar";
import { selectSessionData } from "@/app/_redux/features/session/sessionDataSlice";
import { selectUiData } from "@/app/_redux/features/ui/uiDataSlice";
import {
  activateVehicleByIndex,
  getVehicleDetails,
  getVehicleList,
  selectActiveVehicleIndex,
  selectVehicleData,
} from "@/app/_redux/features/vehicleData/vehicleDataSlice";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const vehicleData = useAppSelector(selectVehicleData);
  const sessionData = useAppSelector(selectSessionData);
  const uiData = useAppSelector(selectUiData);
  const activeVehicleIndex = useAppSelector(selectActiveVehicleIndex);
  const dispatch = useAppDispatch();

  const [state, setState] = useState({
    loginStatus: false,
    navBarState: true,
  });

  // This effect runs only once when header is mounted
  useEffect(() => {
    // Fetch vehicle list when component loads
    if (vehicleData?.length === 0 && sessionData.id) {
      dispatch(getVehicleList());
    }
  }, []);

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

  return (
    <>
      <NavBar isVisible={state.navBarState} closeNavBar={closeNavBar} />
      <div className="dashboard-container">
        <Header setNavBarState={setNavBarState} navBarState={state.navBarState} />
        {children}
      </div>
    </>
  );
}
