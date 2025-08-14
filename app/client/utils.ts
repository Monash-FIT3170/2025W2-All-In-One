import { clsx } from "clsx";
import { NavigateFunction } from "react-router";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

export function handleSearch(query: string, navigate: NavigateFunction) {
    const cleanedQuery = query.trim();
    if (cleanedQuery) {
        navigate(
            `/search?q=${encodeURIComponent(cleanedQuery.replace(/\s+/g, "+"))}`
        );
    }
}
