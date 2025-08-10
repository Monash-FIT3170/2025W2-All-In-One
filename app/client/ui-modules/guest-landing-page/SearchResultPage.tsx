import React, { useEffect, useState } from "react";
import { Button } from "../theming-shadcn/Button";
import { PropertyCard } from "./components/PropertyCard";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { getPropertyWithListingDataUseCase } from "../../library-modules/use-cases/property-listing/GetPropertyWithListingDataUseCase";
import { PropertyWithListingData } from "../../library-modules/use-cases/property-listing/models/PropertyWithListingData";
import { searchProperties } from "../../library-modules/domain-models/property/repositories/property-repository";

// Utility to get the "q" param from the URL
function getQueryParam(param: string): string {
    const params = new URLSearchParams(window.location.search);
    return params.get(param) ?? "";
}

export function GuestSearchResultsPage() {
    const query = getQueryParam("q");
    const [properties, setProperties] = useState<PropertyWithListingData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(3);
    const [searchQuery, setSearchQuery] = useState(query);
    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);

            try {
                const baseResults = await searchProperties(query);

                const resultsWithListingData = await Promise.all(
                    baseResults.map((prop: { propertyId: string }) =>
                        getPropertyWithListingDataUseCase(prop.propertyId)
                    )
                );

                setProperties(resultsWithListingData);
                setError(null);
            } catch (err: any) {
                console.error("Search error caught:", err);
                setError("An error occurred while searching properties.");
            } finally {
                setIsLoading(false);
            }
        };

        if (query) fetch();
    }, [query]);

    return (
        <div className="p-5">
            <div className="text-center mb-6">
                <h1 className="geist-extrabold text-[40px]">Search Results</h1>
                <p className="geist-light text-[18px]">
                    Showing results for "<strong>{query}</strong>"
                </p>
            </div>

            {isLoading ? (
                <div className="text-center">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : properties.length === 0 ? (
                <div className="text-center">
                    No results found for "{query}"
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-6 text-center">
                        Matching Properties
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center px-4">
                        {properties.slice(0, visibleCount).map((prop) => (
                            <PropertyCard key={prop.propertyId} {...prop} />
                        ))}
                    </div>
                    {visibleCount < properties.length && (
                        <div className="mt-6 text-center">
                            <Button
                                onClick={() =>
                                    setVisibleCount(visibleCount + 3)
                                }
                            >
                                View More
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
