"use client";
import LandingContent from "./_components/LandingContent";
import { Header } from "./_components/Header";

function Home() {
  return (
    <div className="dashboard-container">
      <Header navBarState={false} setNavBarState={() => {}} />
      <LandingContent />
    </div>
  );
}

export default Home;
