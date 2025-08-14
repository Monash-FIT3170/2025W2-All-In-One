import { clsx } from "clsx";
import { NavigateFunction } from "react-router";
import { twMerge } from "tailwind-merge";
import { NavigationPath } from "./navigation";

export function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

// builds the url and will navigate to the search results page with the query
export function handleSearch(query: string, navigate: NavigateFunction) {
    const url = buildSearchUrl(query);
    if (url) navigate(url);
}

//
export function buildSearchUrl(q: string) {
    const encoded = encodeSearchQuery(q);
    return encoded ? `${NavigationPath.Search}?q=${encoded}` : null;
}

export function encodeSearchQuery(q: string) {
    const cleaned = q.trim();
    if (!cleaned) return "";
    return encodeURIComponent(cleaned.replace(/%20/g, "+"));
}

export function decodeSearchQuery(encoded: string) {
    return decodeURIComponent(encoded || "")
        .replace(/\+/g, "%20")
        .trim();
}

export function getQParam(search: string) {
    const params = new URLSearchParams(search);
    return params.get("q") ?? "";
}
