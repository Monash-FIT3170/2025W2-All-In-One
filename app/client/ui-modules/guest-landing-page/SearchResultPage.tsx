import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../theming-shadcn/Button";
import { PropertyCard } from "./components/PropertyCard";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { getPropertyWithListingDataUseCase } from "../../library-modules/use-cases/property-listing/GetPropertyWithListingDataUseCase";
import { PropertyWithListingData } from "../../library-modules/use-cases/property-listing/models/PropertyWithListingData";
import { searchProperties } from "../../library-modules/domain-models/property/repositories/property-repository";

import { Input } from "../theming-shadcn/Input";
import { useLocation, useNavigate } from "react-router";
import { set } from "date-fns";

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
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [searchQuery, setSearchQuery] = useState(query.replace(/\+/g, " "));

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
                setError("Failed to fetch properties. Please try again later.");
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
            {/* HERO — headline + pill search, faint rings */}
            <div className="relative px-4">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[520px] max-w-5xl opacity-50
          [background:repeating-radial-gradient(ellipse_at_center,rgba(0,0,0,0.06)_0,rgba(0,0,0,0.06)_1px,transparent_1px,transparent_120px)]
          [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
                />
                <div className="relative mx-auto max-w-5xl py-12 text-center">
                    <h1 className="geist-extrabold text-3xl sm:text-4xl md:text-[40px]">
                        Find your perfect rental home
                    </h1>
                    <div className="mt-6 mx-auto w-full max-w-2xl">
                        {/* pill search bar */}
                        <div className="flex rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                            <div className="relative flex-1">
                                {/* search icon */}
                                <svg
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle cx="11" cy="11" r="7" />
                                    <line
                                        x1="21"
                                        y1="21"
                                        x2="16.65"
                                        y2="16.65"
                                    />
                                </svg>
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

                                    // encodes the cleaned query for URL
                                    navigate(
                                        `/search?q=${encodeURIComponent(
                                            cleaned.replace(/\s+/g, "+")
                                        )}`
                                    );
                                }}
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RESULTS INFO */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <p className="mb-4 text-[15px] font-medium">
                    {isLoading
                        ? "Loading properties…"
                        : `${properties.length} properties found for "${
                              decodedQueryForDisplay || "—"
                          }"`}
                </p>
            </div>

            {/* CARDS */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
                {error && (
                    <div className="text-center text-red-500">{error}</div>
                )}

                {!isLoading && !error && properties.length === 0 && (
                    <div className="text-center text-neutral-700">
                        No results found for “{decodedQueryForDisplay}”.
                    </div>
                )}

                {!isLoading && !error && properties.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {shown.map((prop) => (
                                <div
                                    key={prop.propertyId}
                                    className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                                >
                                    <PropertyCard {...prop} />
                                    {/* Optional: uncomment if you want the per-card CTA like the mock */}
                                    {/* <div className="px-4 pb-4">
                    <Button variant="outline" className="h-9 w-full rounded-xl">View details</Button>
                  </div> */}
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
