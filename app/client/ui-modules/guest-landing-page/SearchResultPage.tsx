import React, { use, useEffect, useMemo, useState } from "react";
import { Button } from "../theming-shadcn/Button";
import { PropertyCard } from "./components/PropertyCard";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { getPropertyWithListingDataUseCase } from "../../library-modules/use-cases/property-listing/GetPropertyWithListingDataUseCase";
import { PropertyWithListingData } from "../../library-modules/use-cases/property-listing/models/PropertyWithListingData";
import { searchProperties } from "../../library-modules/domain-models/property/repositories/property-repository";

import { Input } from "../theming-shadcn/Input";
import { useLocation, useNavigate } from "react-router";
import { handleSearch } from "../../utils";

// load up 9 properties at a time
const PAGE_SIZE = 9;

// Utility to get the "q" param from the URL
function getQueryParam(search: string): string {
    const params = new URLSearchParams(search);
    return params.get("q") ?? "";
}

export function GuestSearchResultsPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [query, setQuery] = useState(getQueryParam(location.search));
    const [properties, setProperties] = useState<PropertyWithListingData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [searchQuery, setSearchQuery] = useState(query.replace(/\+/g, " "));

    // decodes the query when URL changes
    useEffect(() => {
        const q = getQueryParam(location.search);
        setQuery(q);
        setSearchQuery(q.replace(/\+/g, " "));
        setVisibleCount(PAGE_SIZE);
    }, [location.search]);

    // fetches the search query, runs it through the database, gets the properties and displays them
    useEffect(() => {
        const run = async () => {
            // decoded query to handle spaces and special characters
            const decodedQuery = decodeURIComponent(query || "").replace(
                /\+/g,
                " "
            );

            // clean up the query by trimming whitespace
            const cleanedQuery = decodedQuery.trim();

            // if the query is empty, reset properties and loading state
            if (!cleanedQuery) {
                setProperties([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            // try to fetch properties based on the cleaned query
            try {
                const results = await searchProperties(cleanedQuery);
                const propertiesWithData: PropertyWithListingData[] =
                    await Promise.all(
                        results.map((property: Property) =>
                            getPropertyWithListingDataUseCase(
                                property.propertyId
                            )
                        )
                    );
                setProperties(propertiesWithData);
            } catch (err) {
                console.error("Search error:", err);
                setProperties([]); // shows no results if there's an error
            } finally {
                setIsLoading(false);
            }
        };
        run();
    }, [query]);

    // Memoize the shown properties to avoid unnecessary recalculations
    const shown = useMemo(
        () => properties.slice(0, visibleCount),
        [properties, visibleCount]
    );

    // Decode the query for display purposes
    const decodedQueryForDisplay = decodeURIComponent(query || "").replace(
        /\+/g,
        " "
    );

    return (
        <div className="min-h-screen bg-white text-neutral-900">
            <div className="relative px-4">
                <div className="relative mx-auto max-w-5xl py-12 text-center">
                    <h1 className="geist-extrabold text-3xl sm:text-4xl md:text-[40px]">
                        Find your perfect rental home
                    </h1>
                    <div className="mt-6 mx-auto w-full max-w-2xl">
                        {/* pill search bar */}
                        <div className="flex rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                            <div className="relative flex-1">
                                <Input
                                    type="search"
                                    placeholder="Melbourne"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="h-12 border-0 rounded-none shadow-none pl-11 focus:ring-0"
                                />
                            </div>
                            <Button
                                className="h-12 rounded-none rounded-r-2xl px-5 bg-neutral-900 text-white hover:bg-neutral-800"
                                onClick={() => {
                                    const cleaned = searchQuery.trim();
                                    if (!cleaned) return;
                                    setVisibleCount(PAGE_SIZE);

                                    // passes to a utility function to handle search
                                    handleSearch(searchQuery, navigate);
                                }}
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* results */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <p className="mb-4 text-[15px] font-medium">
                    {isLoading
                        ? "Loading properties…"
                        : `${properties.length} properties found for "${
                              decodedQueryForDisplay || "—"
                          }"`}
                </p>
            </div>

            {/* property cards */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
                {!isLoading && properties.length === 0 && (
                    <div className="text-center text-neutral-700">
                        No results found for “{decodedQueryForDisplay}”.
                    </div>
                )}

                {!isLoading && properties.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {shown.map((prop) => (
                                <div
                                    key={prop.propertyId}
                                    className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                                >
                                    <PropertyCard {...prop} />
                                </div>
                            ))}
                        </div>

                        {visibleCount < properties.length && (
                            <div className="mt-8 flex justify-center">
                                <Button
                                    className="h-11 px-6 rounded-xl"
                                    onClick={() =>
                                        setVisibleCount((c) => c + PAGE_SIZE)
                                    }
                                >
                                    View more
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
