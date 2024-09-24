"use client";
import LandingContent from "./_components/LandingContent";
import { Header } from "./_components/Header";
import LoginForm from "./_components/forms/LoginForm";
import { useAppDispatch, useAppSelector } from "./_redux/hooks";
import { selectUiData, setUiData } from "./_redux/features/ui/uiDataSlice";

function Home() {
  const uiData = useAppSelector(selectUiData);
  const dispatch = useAppDispatch();

  const handleclose = () => {
    dispatch(setUiData({ ...uiData, loginFormVisibility: false }));
  };

  return (
    <div className="dashboard-container">
      <LoginForm open={uiData.loginFormVisibility} onClose={handleclose}></LoginForm>
      <Header navBarState={false} setNavBarState={() => {}} />
      <LandingContent />
    </div>
  );
}

export default Home;
