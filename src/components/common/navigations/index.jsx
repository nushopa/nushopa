import DesktopNavigation from "./desktopNavigation";
import { navigationLink } from "../../../data/navLinks/navigationLinks";
import { useEffect, useState } from "react";
import { client } from "../../../services/sanity/sanityClient";
import { MbileNavbar } from "./mobileNavigation";
// import MobileNavigation from "./mobileNavigation";

const Navigations = () => {
  const [navigationLinks, setNavigationLinks] = useState([] || navigationLink);
  useEffect(() => {
    client
      .fetch('*[_type == "navigationLink"] | order(_createdAt asc)')
      .then((data) => {
        const homeIndex = data.findIndex((item) => item.label === "Home");
        // Rearrange the array so it starts from "Home"
        const arrangedData = [
          ...data.slice(homeIndex),
          ...data.slice(0, homeIndex),
        ];
        setNavigationLinks(arrangedData);
      })
  }, []);

  return (
    <div className=" bg-mainGreen md:bg-inherit z-[999] sticky top-0">
      <div className="hidden md:flex bg-[#f4f4f4] rounded-lg py-6 px-8 font-workSans sticky top-2 left-0 w-[95%] mx-auto justify-between items-center">
        <DesktopNavigation navigationItems={navigationLinks} />
      </div>
      <div className="flex md:hidden bg-[#f4f4f4] mx-auto justify-center font-workSans sticky top-2 left-0  items-center">
        <MbileNavbar navigationItems={navigationLinks}/>
      </div>
    </div>
  );
};

export default Navigations;
