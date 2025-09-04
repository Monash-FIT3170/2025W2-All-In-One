import React from 'react';
import { twMerge } from 'tailwind-merge';
import { FilterType } from '../enums/FilterType';
import { FilterIcon } from './FilterIcon';
import { Role } from '/app/shared/user-role-identifier';
import { UserAccount } from '/app/client/library-modules/domain-models/user/UserAccount';


type FilterTabsProps = {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  userRole?: UserAccount["role"];
}

export function FilterTabs({ activeFilter, onFilterChange, userRole }: FilterTabsProps): React.JSX.Element {
  const isLandlord = userRole === Role.LANDLORD;
  const isAgent = userRole === Role.AGENT;

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onFilterChange(FilterType.ALL)}
            className={twMerge(
              "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
              activeFilter === FilterType.ALL
                ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            All
          </button>
          {isAgent && (
            <>
              <button
                onClick={() => onFilterChange(FilterType.REJECTED)}
                className={twMerge(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  activeFilter === FilterType.REJECTED
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                Rejected
              </button>
              <button
                onClick={() => onFilterChange(FilterType.ACCEPTED)}
                className={twMerge(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  activeFilter === FilterType.ACCEPTED
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                Accepted
              </button>
            </>
          )}

          {isLandlord && (
            <>
              <button
                onClick={() => onFilterChange(FilterType.REJECTED)}
                className={twMerge(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  activeFilter === FilterType.REJECTED
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                Rejected
              </button>
              <button
                onClick={() => onFilterChange(FilterType.ACCEPTED)}
                className={twMerge(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  activeFilter === FilterType.ACCEPTED
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                Approved
              </button>
            </>
          )}
        </div>
        {/* Filter Icon */}
        <button className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100 transition-colors">
          <FilterIcon />
        </button>
      </div>
    </div>
  );
}
