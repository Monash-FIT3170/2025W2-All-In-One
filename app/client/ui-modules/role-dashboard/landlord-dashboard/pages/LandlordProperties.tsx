import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { selectProperties, fetchLandlordDetails } from "../state/landlord-dashboard-slice";
import PropertyCard from "../components/PropertyCard";

export function LandlordProperties(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const properties = useAppSelector(selectProperties);
  const currentUser = useAppSelector((state) => state.currentUser.authUser);
  
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchLandlordDetails(currentUser.userId));
    }
  }, [dispatch, currentUser?.userId]);
  console.log(properties);
  // Filter options
  const filterOptions = [
    { label: "All", value: "All" },
    { label: "Occupied", value: PropertyStatus.OCCUPIED },
    { label: "Vacant", value: PropertyStatus.VACANT },
    { label: "Maintenance", value: PropertyStatus.UNDER_MAINTENANCE },
  ];

  // Filter and search properties
  const filteredProperties = useMemo(() => {
    let filtered = properties;

    // Apply status filter
    if (selectedFilter !== "All") {
      filtered = filtered.filter(property => property.propertyStatus === selectedFilter);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(property => 
        `${property.streetnumber} ${property.streetname}`.toLowerCase().includes(search) ||
        property.suburb.toLowerCase().includes(search) ||
        property.postcode.includes(search) ||
        property.type.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [properties, selectedFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Properties You Own</h1>
          
          {/* Search and Filter Section */}
          <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedFilter === option.value
                      ? "bg-gray-900 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* All Types Dropdown */}
            <div className="relative">
              <select
                className="appearance-none bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                defaultValue="All Types"
              >
                <option value="All Types">All Types</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Cottage">Cottage</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Filter Icon */}
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>

          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              {filteredProperties.length === 0 
                ? "No properties found"
                : `Showing ${filteredProperties.length} of ${properties.length} properties`
              }
            </p>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0v-4a1 1 0 011-1h4a1 1 0 011 1v4m-5 0h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500">
                {searchTerm.trim() || selectedFilter !== "All"
                  ? "Try adjusting your search or filter criteria"
                  : "You don't have any properties yet"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.propertyId} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
