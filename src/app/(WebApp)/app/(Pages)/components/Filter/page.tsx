"use client";
import React from "react";
import { FilterAndSortControlsProps } from "@/constants/interfaces";

const FilterAndSortControls: React.FC<FilterAndSortControlsProps> = ({
  filters,
  setFilters,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      {/* Filters */}
      <div className="flex gap-4">
        <select
          className="rounded border border-gray-300 p-2"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="ACCEPTED">Accepté</option>
          <option value="REFUSED">Non accepté</option>
        </select>

        <input
          type="date"
          className="rounded border border-gray-300 p-2"
          value={filters.startTime}
          onChange={(e) =>
            setFilters({ ...filters, startTime: e.target.value })
          }
        />
      </div>

      {/* Sort Order */}
      <select
        className="rounded border border-gray-300 p-2"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="asc">Ordre croissant</option>
        <option value="desc">Ordre décroissant</option>
      </select>
    </div>
  );
};

export default FilterAndSortControls;
