import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import { Button } from "../../../theming-shadcn/Button";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { ListingStatus } from "/app/shared/api-models/property-listing/ListingStatus";
import {
  fetchAgentPropertiesWithListingData,
  selectAgentPropertiesWithListingDataState,
  selectAgentPropertySearch,
  selectAgentPropertyStatusFilter,
  setSearch,
  setStatusFilter
} from "../state/agent-property-slice";
import { PropertyCard } from "../../../guest-landing-page/components/PropertyCard";
import { useNavigate } from "react-router";

export function AgentProperty(): React.JSX.Element {
  const currentUser = useAppSelector((state) => state.currentUser.authUser);
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectAgentPropertySearch);
  const statusFilter = useAppSelector(selectAgentPropertyStatusFilter);
  const { propertiesWithListingData, isLoading, error } = useAppSelector(selectAgentPropertiesWithListingDataState);
  const navigate = useNavigate();
  // Filter options restricted to requested subset
  const STATUS_OPTIONS = [
    "ALL",
    ListingStatus.DRAFT,  
    PropertyStatus.VACANT,  
    PropertyStatus.OCCUPIED,
    ListingStatus.CLOSED,   
  ];
  useEffect(() => {
    // Fetch agent properties when the component mounts
    if (currentUser) {
      dispatch(fetchAgentPropertiesWithListingData(currentUser.userId));
    }
  }, [currentUser, dispatch]);
  console.log("Properties with listing data:", propertiesWithListingData);

  return (
    <div className="min-h-screen">
      <div className="flex">
        <div className="flex-1 p-6">
          {/* Header Row with Title and Action Button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Agent Properties</h2>
            <Button size="sm" variant="default" onClick={() => navigate("/propertyform")} >+ List a Property</Button>
          </div>

          {/* Search Bar + Filter Bar Row */}
          <div className="mb-6 flex items-center gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                placeholder="Search properties..."
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 justify-end">
              {STATUS_OPTIONS.map(status => {
                const selected = statusFilter === status;
                return (
                  <Button
                    key={status}
                    type="button"
                    variant="ghost"
                    onClick={() => dispatch(setStatusFilter(status))}
                    className={
                      `inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ` +
                      (selected
                        ? "bg-white text-black border-gray-400 shadow-sm"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200")
                    }
                  >
                    {status}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Properties list / states */}
          <div className="text-gray-500 text-sm italic">
            {isLoading && <p>Loading properties...</p>}
            {!isLoading && !error && propertiesWithListingData.length === 0 && (
              <p>No properties to display yet.</p>
            )}
            {!isLoading && !error && propertiesWithListingData.length > 0 && (
              <ul className="not-italic text-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center px-4">
                {propertiesWithListingData
                    .filter((property) => {
                      const listingStatus = property.listing_status.toUpperCase();
                      const propertyStatus = property.propertyStatus.toUpperCase();

                      let matchesStatus: boolean;
                      switch (statusFilter) {
                        case ListingStatus.DRAFT:
                        case ListingStatus.LISTED:
                        case ListingStatus.CLOSED:
                          matchesStatus = listingStatus === statusFilter;
                          break;
                        case PropertyStatus.OCCUPIED:
                          matchesStatus = propertyStatus === statusFilter; // filter already uppercase for property statuses
                          break;
                        default:
                          matchesStatus = true;
                          break;
                      }
                      if (!matchesStatus) return false;
                      const matchesSearch = property.streetname.toUpperCase().includes(search.trim().toUpperCase());
                      return matchesSearch && matchesStatus;
                  })
                  .map((property) => (
                    <li key={property.propertyId}>
                      <PropertyCard {...property} />
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
