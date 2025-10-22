// components/CustomTable.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";

const CustomTable = ({
  columns = [],
  data = [],
  actions = [],
  onRowClick,
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 10,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortConfig, setSortConfig] = useState(null);
  const [filterText, setFilterText] = useState("");

  // Reset page when filters or pageSize changes
  useEffect(() => {
    setPage(1);
  }, [pageSize, filterText]);

  // Sorting & Filtering
  const sortedData = useMemo(() => {
    let sortableData = [...data];

    if (filterText) {
      sortableData = sortableData.filter((row) =>
        Object.values(row)
          .map((v) => (v ? String(v) : ""))
          .join(" ")
          .toLowerCase()
          .includes(filterText.toLowerCase())
      );
    }

    if (sortConfig) {
      sortableData.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortableData;
  }, [data, sortConfig, filterText]);

  // Pagination
  const totalPages = useMemo(
    () => Math.ceil(sortedData.length / pageSize),
    [sortedData, pageSize]
  );

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [page, totalPages]);

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  return (
    <div className="custom-table p-4 bg-white shadow rounded-md">
      {/* Global Filter */}
      <div className="mb-3 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border rounded px-3 py-1 w-1/3 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                <div className="flex items-center">
                  {col.label}
                  {sortConfig?.key === col.key &&
                    (sortConfig.direction === "asc" ? (
                      <FiArrowUp className="ml-1" />
                    ) : (
                      <FiArrowDown className="ml-1" />
                    ))}
                </div>
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-sm text-gray-800">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-4 py-2 space-x-2">
                    {actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                        className="inline-flex items-center px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        {action.icon && (
                          <span className="mr-1">{action.icon}</span>
                        )}
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                className="px-4 py-6 text-center text-gray-500"
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-3 flex items-center justify-end space-x-3">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          <FiChevronLeft />
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          <FiChevronRight />
        </button>

        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="ml-3 border rounded px-2 py-1"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} / page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CustomTable;
