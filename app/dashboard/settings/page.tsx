"use client";

import { selectSessionData } from "@/app/_redux/features/session/sessionDataSlice";
import { useAppSelector } from "@/app/_redux/hooks";

export default function Settings() {
  const sessionData = useAppSelector(selectSessionData);

  return (
    <div className="data-container">
      <div className="settings-container">
        <label>User e-mail:&ensp;</label>
        <label>{sessionData.email}</label>
      </div>
    </div>
  );
}
