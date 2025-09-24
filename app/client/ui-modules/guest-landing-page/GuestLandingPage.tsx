import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Link, useNavigate } from "react-router";
import Ripple from "./animations/Ripple";
import { Button } from "../theming-shadcn/Button";
import { Input } from "../theming-shadcn/Input";
import { PropertyCard } from "./components/PropertyCard";
import { PropertyCardBlank } from "./components/PropertyCardBlank";
import {
  fetchPropertiesAndListings,
  selectGuestLandingPageUiState,
} from "./state/reducers/guest-landing-page-slice";
import { useAppDispatch, RootState } from "../../store";
import { handleSearch } from "../../utils";

export function GuestLandingPage() {
  const dispatch = useAppDispatch();
  const {
    properties: listedProperties,
    isLoading,
    error,
  } = useSelector((state: RootState) => selectGuestLandingPageUiState(state));

  const [visibleCount, setVisibleCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPropertiesAndListings({ skip: 0, limit: 10 }));
  }, [dispatch]);

  const handleViewMore = () => {
    dispatch(
      fetchPropertiesAndListings({
        skip: listedProperties.length,
        limit: 6,
      })
    );
    setVisibleCount(visibleCount + 6);
  };

  return (
    <div className="p-5">
      <div className="relative flex flex-col items-center justify-center min-h-[80vh] bg-white overflow-hidden px-4">
        <Ripple />
        <div className="relative z-10 text-center">
          <h1 className="geist-extrabold text-[70px]">
            Find your perfect rental home
          </h1>
          <p className="geist-light text-[18px]">
            Search thousands of rental properties in your area
          </p>
          <div className="flex justify-center gap-4">
            <Input
              type="Search"
              placeholder="Enter a postcode or suburb"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Button
              onClick={() => {
                handleSearch(searchQuery, navigate);
              }}
            >
              Search
            </Button>
          </div>
          <div className="py-10 text-center">
            {error || listedProperties.length === 0 ? (
              <div>
                No properties found at the moment. Please check back later!
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-6">
                  Featured Rental Properties
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center px-4">
                  {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <PropertyCardBlank key={i} />
                      ))
                    : listedProperties
                        .slice(0, visibleCount)
                        .map((prop) => (
                          <PropertyCard key={prop.propertyId} {...prop} />
                        ))}
                </div>
                {listedProperties.length > visibleCount && (
                  <div className="mt-6">
                    <Button onClick={handleViewMore}>View More</Button>
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
