import React, { useEffect } from "react";
import { useSelector } from "react-redux"; 

import { Link } from "react-router";
import Ripple from "./animations/Ripple";
import { SideNavBar } from "../navigation-bars/side-nav-bars/SideNavbar";
import { TopNavbar } from "../navigation-bars/TopNavbar";
import { Button } from "../theming-shadcn/Button";
import { Input } from "../theming-shadcn/Input";
import { agentLinks } from "../navigation-bars/side-nav-bars/side-nav-link-definitions";
import { PropertyCard } from "./components/PropertyCard"; 
import {
    fetchPropertiesAndListings,
    selectGuestLandingPageUiState,
    setSidebarOpen,
    updateVisibleCount
} from "./state/reducers/guest-landing-page-slice";
import { RootState, useAppDispatch } from "../../store";


export function GuestLandingPage() {
    const dispatch = useAppDispatch();
    const {
        properties: listedProperties,
        isLoading,
        error,
        isSidebarOpen,
        visibleCount
    } = useSelector((state: RootState) => selectGuestLandingPageUiState(state));

    useEffect(() => {
        dispatch(fetchPropertiesAndListings());
    }, [dispatch]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-5">
            <TopNavbar onSideBarOpened={() => dispatch(setSidebarOpen(true))} />
            <SideNavBar isOpen={isSidebarOpen} onClose={() => dispatch(setSidebarOpen(false))} navLinks={agentLinks} />
            <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white px-4 relative overflow-hidden">
            <Ripple />
            <div className="z-10 text-center relative">
                <h1 className="geist-extrabold text-[70px]">Find your perfect rental home</h1>
                <p className="geist-light text-[18px]">Search thousands of rental properties in your area</p>
                <div className="flex justify-center gap-4">
                <Input type="search" placeholder="Enter a postcode or suburb" />
                <Link to="/"><Button>Search</Button></Link>
                </div>
                <div className="py-10">
                {error || listedProperties.length === 0 ? (
                    <div>No properties found at the moment. Please check back later!</div>
                ) : (
                    <>
                    <h2 className="text-xl font-semibold mb-6">Featured Rental Properties</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
                        {listedProperties.slice(0, visibleCount).map(prop => (
                        <PropertyCard key={prop.propertyId} {...prop} />
                        ))}
                    </div>
                    {visibleCount < listedProperties.length && (
                        <div className="mt-6">
                        <Button onClick={() => dispatch(updateVisibleCount({ type: "increment", value: 3 }))}>View More</Button>
                        </div>
                    )}
                    </>
                )}
                </div>
            </div>
            </div>
        </div>
    );
}
