import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import AddRoadRoundedIcon from "@mui/icons-material/AddRoadRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import TireRepairRoundedIcon from "@mui/icons-material/TireRepairRounded";
import LocalGasStationRoundedIcon from "@mui/icons-material/LocalGasStationRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import RequestPageRoundedIcon from "@mui/icons-material/RequestPageRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import { NavBarButton } from "./NavBarButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/app/_redux/hooks";
import { selectUiData } from "@/app/_redux/features/ui/uiDataSlice";

type NavBarProps = {
  isVisible: boolean;
  closeNavBar: () => void;
};

function NavBar({ isVisible, closeNavBar }: NavBarProps) {
  const [selectedNavItemIndex, setSelectedNavItemIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const uiData = useAppSelector(selectUiData);

  const navBarButtons = [
    { icon: HomeRoundedIcon, route: "/dashboard" },
    { icon: DirectionsCarRoundedIcon, route: "/dashboard/vehicles" },
    { icon: LocalGasStationRoundedIcon, route: "/dashboard/consumption" },
    { icon: AddRoadRoundedIcon, route: "/dashboard/mileage" },
    { icon: HealthAndSafetyRoundedIcon, route: "/dashboard/insurance" },
    { icon: TireRepairRoundedIcon, route: "/dashboard/maintenance" },
    { icon: RequestPageRoundedIcon, route: "/dashboard/tickets" },
    { icon: ReportProblemRoundedIcon, route: "/dashboard/accidents" },
    { icon: SettingsRoundedIcon, route: "/dashboard/settings" },
  ];

  const changeRoute = (route: string, index: number) => () => {
    if (uiData.mobileLayout) {
      closeNavBar();
    }
    router.push(route);
    setSelectedNavItemIndex(index);
  };

  // Set selected item in case user navigates via URL instead of UI
  useEffect(() => {
    setSelectedNavItemIndex(navBarButtons.findIndex((button) => button.route === pathname));
  }, []);

  return (
    isVisible && (
      <div className="nav-bar">
        <div className="logo">
          <p>
            CarChronicle<sup>beta</sup>
          </p>
        </div>

        <div className="nav-items">
          {navBarButtons.map(({ icon: Icon, route }, index) => (
            <NavBarButton
              key={route}
              icon={Icon}
              text={route.split("/")[route.split("/").length - 1]}
              clickAction={changeRoute(route, index)}
              selected={index === selectedNavItemIndex}
            />
          ))}
        </div>
      </div>
    )
  );
}

export default NavBar;
