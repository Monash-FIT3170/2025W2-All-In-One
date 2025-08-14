import React, { useEffect, useState } from "react";
import { Button } from "../theming-shadcn/Button";
import { PropertyCard } from "../guest-landing-page/components/PropertyCard";

import { Input } from "../theming-shadcn/Input";
import { useLocation, useNavigate } from "react-router";
import { getPropertyWithListingDataUseCase } from "/app/client/library-modules/use-cases/property-listing/GetPropertyWithListingDataUseCase";
import { PropertyWithListingData } from "/app/client/library-modules/use-cases/property-listing/models/PropertyWithListingData";
import { searchProperties } from "/app/client/library-modules/domain-models/property/repositories/property-repository";

// load up properties in pages (handled in slice)

// local helpers and constants
const PAGE_SIZE = 9;
function encodeSearchQuery(q: string) {
    const cleaned = q.trim();
    if (!cleaned) return "";
    return encodeURIComponent(cleaned.replace(/%20/g, "+"));
}
function decodeSearchQuery(encoded: string) {
    return decodeURIComponent(encoded || "")
        .replace(/\+/g, "%20")
        .trim();
}
function getQParam(search: string) {
    const params = new URLSearchParams(search);
    return params.get("q") ?? "";
}
function buildSearchUrl(q: string) {
    const encoded = encodeSearchQuery(q);
    return encoded ? `/search?q=${encoded}` : null;
}

export function GuestSearchResultsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const decodedUrlQuery = decodeSearchQuery(getQParam(location.search));

    const [searchQuery, setSearchQuery] = useState(decodedUrlQuery);
    const [properties, setProperties] = useState<PropertyWithListingData[]>([]);
    const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
    const [loading, setLoading] = useState<boolean>(false);
    const shown = properties.slice(0, visibleCount);

    useEffect(() => {
        const q = decodedUrlQuery;
        setSearchQuery(q);
        setVisibleCount(PAGE_SIZE);

        const run = async () => {
            const trimmed = q.trim();
            if (!trimmed) {
                setProperties([]);
                return;
            }
            setLoading(true);
            try {
                const results = await searchProperties(trimmed);
                const enriched = await Promise.all(
                    results.map((p) =>
                        getPropertyWithListingDataUseCase(p.propertyId)
                    )
                );
                setProperties(enriched);
            } catch (e: any) {
                console.error("Failed to load search results:", e);
                setProperties([]);
            }
            setLoading(false);
        };
        run();
    }, [location.search, decodedUrlQuery]);

    const onSearch = () => {
        const cleaned = searchQuery.trim();
        if (!cleaned) return;
        const url = buildSearchUrl(searchQuery);
        if (url) navigate(url);
    };

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
                                onClick={onSearch}
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
                    {loading
                        ? "Loading properties…"
                        : `${properties.length} properties found for "${
                              decodedUrlQuery || "—"
                          }"`}
                </p>
            </div>

            {/* property cards */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
                {!loading && properties.length === 0 && (
                    <div className="text-center text-neutral-700">
                        No results found for “{decodedUrlQuery}”.
                    </div>
                )}

                {!loading && properties.length > 0 && (
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
                                        setVisibleCount((c) =>
                                            Math.min(
                                                c + PAGE_SIZE,
                                                properties.length
                                            )
                                        )
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
