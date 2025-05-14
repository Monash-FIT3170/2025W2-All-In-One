import React from "react";
import { GuestLandingPageUiState } from "./state/GuestLandingPageUiState";
import { Link } from "react-router";
import Ripple from "./animations/Ripple";
import { selectGuestLandingPageUiState } from "./state/reducers/guest-landing-page-slice";
import { useSelector } from "react-redux";
import { SideNavBar } from "../navigation-bars/side-nav-bars/SideNavbar";
import { TopNavbar } from "../navigation-bars/TopNavbar";
import { Button } from "../theming-shadcn/Button";
import { Input } from "../theming-shadcn/Input";
import { agentLinks } from "../navigation-bars/side-nav-bars/side-nav-link-definitions";
import { PropertyCard } from "./components/PropertyCard";

export function GuestLandingPage(): React.JSX.Element {
  const GuestLandingPageUiState: GuestLandingPageUiState = useSelector(
    selectGuestLandingPageUiState
  );

  return (
    <GuestLandingPageBase GuestLandingPageUiState={GuestLandingPageUiState} />
  );
}

function GuestLandingPageBase({
  GuestLandingPageUiState,
}: {
  GuestLandingPageUiState: GuestLandingPageUiState;
}): React.JSX.Element {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(3);

  const properties = [{ //Replace with actual listing data from database.
      imageUrl: "/images/property1.jpg",
      address: "25 Reno Street",
      beds: 2,
      baths: 1,
      availability: "Available now",
      pricePerWeek: "$450",
    },
    {
      imageUrl: "/images/property2.jpg",
      address: "30 First Avenue",
      beds: 3,
      baths: 2,
      availability: "Available 15 Apr",
      pricePerWeek: "$520",
    },
    {
      imageUrl: "/images/property3.jpg",
      address: "15 Park Road",
      beds: 1,
      baths: 1,
      availability: "Available now",
      pricePerWeek: "$380",
    },
    {
      imageUrl: "/images/property4.jpg",
      address: "9 High Street",
      beds: 2,
      baths: 1,
      availability: "Available 10 May",
      pricePerWeek: "$410",
    },
    {
      imageUrl: "/images/property5.jpg",
      address: "12 Ocean View",
      beds: 4,
      baths: 3,
      availability: "Available now",
      pricePerWeek: "$680",
    },
    {
      imageUrl: "/images/property6.jpg",
      address: "13 Mountain Road",
      beds: 4,
      baths: 3,
      availability: "Available now",
      pricePerWeek: "$680",
    },
    {
      imageUrl: "/images/property7.jpg",
      address: "14 River Lane",
      beds: 4,
      baths: 3,
      availability: "Available now",
      pricePerWeek: "$680",
    },
    {
      imageUrl: "/images/property8.jpg",
      address: "8 Lake Drive",
      beds: 4,
      baths: 3,
      availability: "Available now",
      pricePerWeek: "$680",
    },
    {
      imageUrl: "/images/property8.jpg",
      address: "190 Pine Street",
      beds: 4,
      baths: 3,
      availability: "Available now",
      pricePerWeek: "$680",
    },
    {
      imageUrl: "/images/property9.jpg",
      address: "69 Jack street",
      beds: 4,
      baths: 3,
      availability: "Available now",
      pricePerWeek: "$680",
    },
    {
      imageUrl: "/images/property10.jpg",
      address: "4 Jay Street",
      beds: 4,
      baths: 3,
      availability: "Available now",
      pricePerWeek: "$680",
    },
  ];

  if (GuestLandingPageUiState.isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="p-5">
        <TopNavbar onSideBarOpened={onSideBarOpened} />

        <SideNavBar
          isOpen={isSidebarOpen}
          onClose={() => onSideBarOpened(false)}
          navLinks={agentLinks}
        ></SideNavBar>

        <div className="relative flex flex-col items-center justify-center min-h-[80vh] bg-white overflow-hidden px-4">
          {/* Animated Ripple Background */}
          <Ripple />
          {/* Foreground content */}
          <div className="relative z-10 text-center">
            <h1 className={`geist-extrabold text-[70px]  `}>
              Find your perfect rental home
            </h1>
            <p className={`geist-light text-[18px] `}>
              Search thousands of rental properties in your area
            </p>
            {/* Search input and button */}
            <div className="flex justify-center gap-4">
              <Input type="Search" placeholder="Enter a postcode or suburb" />
              <Link to="/login">
                <Button>Search</Button>
              </Link>
            </div>

            <div className="py-10 text-center">
              <h2 className="text-xl font-semibold mb-6">Featured Rental Properties</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center px-4">
                 {properties.slice(0, visibleCount).map((prop, index) => (
                <PropertyCard key={index} {...prop} />
              ))}
              </div>
              {visibleCount < properties.length && (
              <div className="mt-6">
                <Button onClick={() => setVisibleCount(visibleCount + 3)}>
                  View More
                </Button>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
