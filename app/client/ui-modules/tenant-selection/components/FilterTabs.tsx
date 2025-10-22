import React from "react";
import { twMerge } from "tailwind-merge";
import { FilterType } from "../enums/FilterType";
import { FilterIcon } from "./FilterIcon";
import { Role } from "/app/shared/user-role-identifier";
import { UserAccount } from "/app/client/library-modules/domain-models/user/UserAccount";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../theming-shadcn/Popover";

type FilterTabsProps = {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  userRole?: UserAccount["role"];
};

export function FilterTabs({
  activeFilter,
  onFilterChange,
  userRole,
}: FilterTabsProps): React.JSX.Element {
  const isLandlord = userRole === Role.LANDLORD;
  const isAgent = userRole === Role.AGENT;

  const availableFilters: FilterType[] = [
    FilterType.ALL,
    FilterType.REVIEW_REQUIRED,
  ];

  if (isAgent || isLandlord) {
    availableFilters.push(FilterType.ACCEPTED, FilterType.REJECTED);
  }

  const getLabel = (filter: FilterType) => {
    if (filter === FilterType.ACCEPTED && isLandlord) return "Approved";
    if (filter === FilterType.REVIEW_REQUIRED) return "Review Required";
    return filter.charAt(0).toUpperCase() + filter.slice(1);
  };

  const filterColours: Record<FilterType, { base: string; active: string }> = {
    [FilterType.ALL]: {
      base: "text-gray-700 hover:bg-gray-300",
      active: "bg-gray-300",
    },
    [FilterType.ACCEPTED]: {
      base: "text-green-700 hover:bg-green-100",
      active: "bg-green-200",
    },
    [FilterType.REJECTED]: {
      base: "text-red-700 hover:bg-red-100",
      active: "bg-red-200",
    },
    [FilterType.REVIEW_REQUIRED]: {
      base: "text-yellow-700 hover:bg-yellow-100",
      active: "bg-yellow-200",
    },
  };

  const getFilterColour = (filter: FilterType, isActive: boolean) => {
    return twMerge(
      "w-full text-left px-3 py-2 text-sm rounded transition-colors duration-200",
      filterColours[filter].base,
      isActive && filterColours[filter].active
    );
  };

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={twMerge(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200",
                filterColours[activeFilter].base,
                filterColours[activeFilter].active
              )}
            >
              <span>
                Filter{" "}
                {activeFilter !== FilterType.ALL
                  ? `(${getLabel(activeFilter)})`
                  : ""}
              </span>
              <FilterIcon />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={8} className="w-48 p-1">
            <div className="space-y-1">
              {availableFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => onFilterChange(filter)}
                  className={getFilterColour(filter, activeFilter === filter)}
                >
                  {getLabel(filter)}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
