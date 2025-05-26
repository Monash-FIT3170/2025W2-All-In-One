import React from 'react';
import { twMerge } from 'tailwind-merge';
import { FilterType } from '../enums/FilterType';
import { FilterIcon } from './FilterIcon';

type FilterTabsProps = {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps): React.JSX.Element {
  return (
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex bg-gray-100 rounded-lg">
          <button
            onClick={() => onFilterChange(FilterType.ALL)}
            className={twMerge(
              "px-3 py-1 text-sm font-medium rounded-md transition-colors",
              activeFilter === FilterType.ALL
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange(FilterType.REJECTED)}
            className={twMerge(
              "px-3 py-1 text-sm font-medium rounded-md transition-colors",
              activeFilter === FilterType.REJECTED
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Rejected
          </button>
          <button
            onClick={() => onFilterChange(FilterType.ACCEPTED)}
            className={twMerge(
              "px-3 py-1 text-sm font-medium rounded-md transition-colors",
              activeFilter === FilterType.ACCEPTED
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Accepted
          </button>
        </div>
        
        {/* Filter Icon */}
        <button className="text-gray-400 hover:text-gray-600">
          <FilterIcon />
        </button>
      </div>
    </div>
  );
}
