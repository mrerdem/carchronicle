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
        <div className="col1">
          <p>
            E-mail:
            <br />
            Units:
          </p>
        </div>
        <div className="col2">
          <p>
            {sessionData.email}
            <br />
            {userPrefs ? Object.values(userPrefs).join(", ") : ""}
          </p>
        </div>
        <div className="col3">
          <p>
            <br />
            <button onClick={handleUserPrefsChange}>Change</button>
          </p>
        </div>
      </div>
    </div>
  );
}
