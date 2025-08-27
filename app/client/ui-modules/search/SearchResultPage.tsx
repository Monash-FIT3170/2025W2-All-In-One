import React, { useEffect, useRef, useState } from "react"
import { Button } from "../theming-shadcn/Button"
import { PropertyCard } from "../guest-landing-page/components/PropertyCard"
import { Input } from "../theming-shadcn/Input"
import { useLocation, useNavigate } from "react-router"
import { useAppDispatch, useAppSelector } from "/app/client/store"
import {
  selectSearch,
  selectShown,
  setDecodedQuery,
  incrementVisibleCount,
  fetchPropertiesByQuery,
  selectIsLoading,
} from "./state/search-result-slice"
import { buildSearchUrl, decodeSearchQuery, getQParam } from "../../utils"

export function GuestSearchResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  const { decodedQuery, properties, error } = useAppSelector(selectSearch)
  const shown = useAppSelector(selectShown)

  const isLoading = useAppSelector(selectIsLoading)

  const decodedUrlQuery = decodeSearchQuery(getQParam(location.search))

  const [input, setInput] = useState(decodedQuery || decodedUrlQuery || "")
  const hydratedRef = useRef(false)

  const onSearch = () => {
    const cleaned = input.trim()

    if (!cleaned) return

    dispatch(setDecodedQuery(cleaned))
    dispatch(fetchPropertiesByQuery(cleaned))

    const url = buildSearchUrl(cleaned)
    if (url) navigate(url)
  }
  // Initial search if there's a URL query but no current search
  useEffect(() => {
    if (!hydratedRef.current) {
      if (decodedUrlQuery) {
        setInput(decodedUrlQuery)
        dispatch(setDecodedQuery(decodedUrlQuery))
        dispatch(fetchPropertiesByQuery(decodedUrlQuery))
      }
      hydratedRef.current = true
    }
  }, [decodedUrlQuery, dispatch])

  // Dispatches to slice to increment the visible count
  const handleLoadMore = () => {
    dispatch(incrementVisibleCount())
  }

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
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
          {isLoading
            ? "Loading properties…"
            : `${properties.length} properties found for "${
                decodedUrlQuery || "—"
              }"`}
        </p>
      </div>

      {/* property cards */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        {!isLoading && properties.length === 0 && (
          <div className="text-center text-neutral-700">
            No results found for "{decodedUrlQuery}".
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

            {shown.length < properties.length && (
              <div className="mt-8 flex justify-center">
                <Button
                  className="h-11 px-6 rounded-xl"
                  onClick={handleLoadMore}
                >
                  View more
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
