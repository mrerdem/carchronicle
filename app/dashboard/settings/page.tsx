"use client";

import { selectSessionData } from "@/app/_redux/features/session/sessionDataSlice";
import { selectUiData, setUiData } from "@/app/_redux/features/ui/uiDataSlice";
import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";

export default function Settings() {
  const sessionData = useAppSelector(selectSessionData);
  const userPrefs = useAppSelector(selectUserPrefs);
  const uiData = useAppSelector(selectUiData);
  const dispatch = useAppDispatch();

  const handleUserPrefsChange = () => {
    dispatch(setUiData({ ...uiData, userPrefsFormVisibility: true }));
  };

  return (
    <div className="data-container">
      <div className="settings-container">
        <div>
          <div className="col1">E-mail:</div>
          <div className="col2">{sessionData.email}</div>
          <div className="col3"></div>
        </div>
        <div>
          <div className="col1">Units:</div>
          <div className="col2">{userPrefs ? Object.values(userPrefs).join(", ") : ""}</div>
          <div className="col3">
            {" "}
            <button className="settings-button" onClick={handleUserPrefsChange}>
              Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
