"use client"

import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  accessorKey?: keyof T; // For sorting when using custom render
  className?: string;
  sortable?: boolean;
  headerClassName?: string;
  sortingFn?: (a: { original: T }, b: { original: T }) => number;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyStateProps?: {
    icon?: string;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  };
  isLoading?: boolean;
  loadingLabel?: string;
  onRowClick?: (item: T) => void;
  className?: string;
  headerClassName?: string;
  rowClassName?: (item: T) => string;
  searchPlaceholder?: string;
  initialItemsPerPage?: number;
  itemsPerPageOptions?: number[];
  actions?: (item: T) => React.ReactNode;
}

type SortConfig<T> = {
  key: keyof T | null;
  direction: 'asc' | 'desc';
  sortingFn?: (a: { original: T }, b: { original: T }) => number;
};

export default function Table<T>({
  columns,
  data: initialData,
  keyExtractor,
  emptyStateProps,
  isLoading = false,
  loadingLabel = "Loading data...",
  onRowClick,
  className = "",
  headerClassName = "bg-teal-50",
  rowClassName = () => "hover:bg-gray-50",
  searchPlaceholder = "Search...",
  initialItemsPerPage = 10,
  itemsPerPageOptions = [5, 10, 25, 50],
  actions,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: null,
    direction: 'asc'
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return initialData;

    return initialData.filter((item) => {
      return columns.some((column) => {

        if (!column.accessorKey) return false;

        const value = item[column.accessorKey as keyof T];
        if (value === null || value === undefined) return false;

        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [initialData, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      // Use custom sorting function if provided
      if (sortConfig.sortingFn) {
        const result = sortConfig.sortingFn({ original: a }, { original: b });
        return sortConfig.direction === 'asc' ? result : -result;
      }

      // Get the values to compare
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue === null || bValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;

      // Handle Date objects
      if (aValue instanceof Date && bValue instanceof Date) {
        const result = aValue.getTime() - bValue.getTime();
        return sortConfig.direction === 'asc' ? result : -result;
      }

      // Handle strings case-insensitively
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const result = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        return sortConfig.direction === 'asc' ? result : -result;
      }

      // Default comparison
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  // Total pages
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Handle sorting
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    const sortKey = column.accessorKey || column.accessor;

    if (typeof sortKey === 'function') return;

    setSortConfig((prevConfig) => {
      // If same column, toggle direction
      if (prevConfig.key === sortKey) {
        return {
          key: sortKey,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
          sortingFn: column.sortingFn
        };
      }
      // New column, default to ascending
      return {
        key: sortKey,
        direction: 'asc',
        sortingFn: column.sortingFn
      };
    });
  };

  // Render sort indicator
  const renderSortIndicator = (column: Column<T>) => {
    if (!column.sortable) return null;

    const sortKey = column.accessorKey || column.accessor;
    if (typeof sortKey === 'function') return null;

    const isSorted = sortConfig.key === sortKey;

    return (
      <span className="ml-1 inline-flex">
        {isSorted ? (
          sortConfig.direction === 'asc' ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )
        ) : (
          <div className="text-gray-400 opacity-50">
            <ChevronDown size={16} />
          </div>
        )}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">{loadingLabel}</p>
        </div>
      </div>
    );
  }

  if (initialData.length === 0 && emptyStateProps) {
    return (
      <div className="text-center py-12">
        {emptyStateProps.icon && (
          <div className="mx-auto w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
            <i className={`${emptyStateProps.icon} text-teal-600 text-2xl`}></i>
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyStateProps.title}</h3>
        <p className="text-gray-500 mb-6">{emptyStateProps.description}</p>
        {emptyStateProps.actionLabel && emptyStateProps.onAction && (
          <button
            onClick={emptyStateProps.onAction}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            {emptyStateProps.actionLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
        {/* Search */}
        <div className="relative mb-3 sm:mb-0 w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Items per page */}
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={headerClassName}>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-left text-sm font-medium text-teal-700 ${column.className || ""} ${column.headerClassName || ""} ${
                    column.sortable ? 'cursor-pointer select-none' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {renderSortIndicator(column)}
                  </div>
                </th>
              ))}
              {/* Add Actions column header if actions prop is provided */}
              {actions && (
                <th className="px-6 py-3 text-left text-sm font-medium text-teal-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className={rowClassName(item)}
                  onClick={onRowClick && !actions ? () => onRowClick(item) : undefined}
                  style={onRowClick && !actions ? { cursor: "pointer" } : undefined}
                >
                  {columns.map((column, columnIndex) => (
                    <td
                      key={columnIndex}
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={onRowClick && actions ? () => onRowClick(item) : undefined}
                      style={onRowClick && actions ? { cursor: "pointer" } : undefined}
                    >
                      {typeof column.accessor === "function"
                        ? column.accessor(item)
                        : (item[column.accessor] as React.ReactNode)}
                    </td>
                  ))}
                  {/* Render Actions column if actions prop is provided */}
                  {actions && (
                    <td className="px-6 py-2 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end space-x-2">
                        {actions(item)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={actions ? columns.length + 1 : columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sortedData.length > 0 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-gray-300 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex space-x-1">
              {totalPages <= 5 ? (
                // Show all pages if 5 or fewer
                [...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === i + 1
                        ? 'bg-teal-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))
              ) : (
                // Show limited pages with ellipsis for larger page counts
                <>
                  {/* First page */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? 'bg-teal-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    1
                  </button>

                  {/* Ellipsis or second page */}
                  {currentPage > 3 && (
                    <span className="px-3 py-1 text-gray-500">...</span>
                  )}

                  {/* Current page range */}
                  {[...Array(5)]
                    .map((_, i) => {
                      const pageNum = currentPage > 3
                        ? (currentPage + i - 2)
                        : (i + 2);

                      if (pageNum > 1 && pageNum < totalPages) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === pageNum
                                ? 'bg-teal-600 text-white'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      return null;
                    })
                    .filter(Boolean)
                    .slice(0, currentPage > 3 ? 3 : 3)}

                  {/* Ellipsis before last page */}
                  {currentPage < totalPages - 2 && (
                    <span className="px-3 py-1 text-gray-500">...</span>
                  )}

                  {/* Last page */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-teal-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-gray-300 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}