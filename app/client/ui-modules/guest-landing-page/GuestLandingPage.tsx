import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; 

import { Link } from "react-router";
import Ripple from "./animations/Ripple";
import { Button } from "../theming-shadcn/Button";
import { Input } from "../theming-shadcn/Input";
import { agentLinks } from "../navigation-bars/side-nav-bars/side-nav-link-definitions";
import { PropertyCard } from "./components/PropertyCard"; 
import {
    fetchPropertiesAndListings,
    selectGuestLandingPageUiState
} from "./state/reducers/guest-landing-page-slice";
import { useAppDispatch, RootState } from "../../store";


export function GuestLandingPage() {
    const dispatch = useAppDispatch();
    const { properties: listedProperties, isLoading, error } = useSelector(
        (state: RootState) => selectGuestLandingPageUiState(state)
    );

    const [isSidebarOpen, onSideBarOpened] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        dispatch(fetchPropertiesAndListings());
    }, [dispatch]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-5">
            <div className="relative flex flex-col items-center justify-center min-h-[80vh] bg-white overflow-hidden px-4">
                <Ripple />
                <div className="relative z-10 text-center">
                    <h1 className="geist-extrabold text-[70px]">Find your perfect rental home</h1>
                    <p className="geist-light text-[18px]">Search thousands of rental properties in your area</p>
                    <div className="flex justify-center gap-4">
                        <Input type="Search" placeholder="Enter a postcode or suburb" />
                        <Link to="/">
                            <Button>Search</Button>
                        </Link>
                    </div>
                    <div className="py-10 text-center">
                        {(error || listedProperties.length === 0) ? (
                            <div>No properties found at the moment. Please check back later!</div>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold mb-6">Featured Rental Properties</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center px-4">
                                    {listedProperties.slice(0, visibleCount).map((prop) => (
                                        <PropertyCard key={prop.propertyId} {...prop} />
                                    ))}
                                </div>
                                {visibleCount < listedProperties.length && (
                                    <div className="mt-6">
                                        <Button onClick={() => setVisibleCount(visibleCount + 3)}>
                                            View More
                                        </Button>
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
