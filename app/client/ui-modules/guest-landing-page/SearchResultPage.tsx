import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Ripple from "./animations/Ripple";
import { Button } from "../theming-shadcn/Button";
import { PropertyCard } from "./components/PropertyCard";
import { Input } from "../theming-shadcn/Input";
import { searchProperties } from "/app/client/library-modules/property/property-service";
import { Property } from "/app/client/library-modules/domain-models/property/Property";

// Custom hook to get query parameters from the URL
function useQueryParam(param: string): string {
    const location = useLocation(); // Get the current location of the app
    const params = new URLSearchParams(location.search);
    return params.get(param) ?? "";
}

export function GuestSearchResultsPage() {
    const query = useQueryParam("q");
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            try {
                const results = await searchProperties(query);
                setProperties(results);
                setError(null);
            } catch (err: any) {
                console.error("Search error:", err);
                setError("An error occurred while searching properties.");
            } finally {
                setIsLoading(false);
            }
        };

        if (query) fetch();
    }, [query]);

    return (
        <div className="p-5">
            <div className="relative flex flex-col items-center justify-center min-h-[80vh] bg-white overflow-hidden px-4">
                <Ripple />
                <div className="relative z-10 text-center">
                    <h1 className="geist-extrabold text-[60px]">
                        Search Results
                    </h1>
                    <p className="geist-light text-[18px]">
                        Showing results for "<strong>{query}</strong>"
                    </p>

                    <div className="flex justify-center gap-4 mt-4">
                        <Input
                            type="Search"
                            placeholder="Search again..."
                            value={query}
                            readOnly
                        />
                        <Link to="/">
                            <Button variant="ghost">Back to Home</Button>
                        </Link>
                    </div>

                    <div className="py-10 text-center">
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : error ? (
                            <div className="text-red-500">{error}</div>
                        ) : properties.length === 0 ? (
                            <div>No results found for "{query}"</div>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold mb-6">
                                    Matching Properties
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center px-4">
                                    {properties
                                        .slice(0, visibleCount)
                                        .map((prop) => (
                                            <PropertyCard
                                                key={prop.propertyId}
                                                {...prop}
                                            />
                                        ))}
                                </div>
                                {visibleCount < properties.length && (
                                    <div className="mt-6">
                                        <Button
                                            onClick={() =>
                                                setVisibleCount(
                                                    visibleCount + 3
                                                )
                                            }
                                        >
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
