import { clsx } from "clsx";
import { NavigateFunction } from "react-router";
import { twMerge } from "tailwind-merge";
import { NavigationPath } from "./navigation";

export function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

export function handleSearch(query: string, navigate: NavigateFunction) {
    const cleanedQuery = query.trim();
    if (cleanedQuery) {
        navigate(
            `${NavigationPath.Search}${encodeURIComponent(
                cleanedQuery.replace(/\s+/g, "+")
            )}`
        );
    }
}

export function encodeSearchQuery(q: string) {
    const cleaned = q.trim();
    if (!cleaned) return "";
    return encodeURIComponent(cleaned.replace(/\s+/g, "+"));
}

export function decodeSearchQuery(encoded: string) {
    return decodeURIComponent(encoded || "")
        .replace(/\+/g, " ")
        .trim();
}

export function buildSearchUrl(q: string) {
    const encoded = encodeSearchQuery(q);
    return encoded ? `/search?q=${encoded}` : null;
}

export function getQParam(search: string) {
    const params = new URLSearchParams(search);
    return params.get("q") ?? "";
}
