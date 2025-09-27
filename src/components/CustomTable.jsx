// components/CustomTable.jsx
import React, { useState } from "react";

const CustomTable = ({
  columns = [],
  data = [],
  actions = [],
  contextMenu = [],
  onRowClick,
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 10,
  fetchData, // optional callback for backend fetching
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortConfig, setSortConfig] = useState(null);
  const [filterText, setFilterText] = useState("");

  // Sorting function
  const sortedData = React.useMemo(() => {
    let sortableData = [...data];

    // Basic filtering
    if (filterText) {
      sortableData = sortableData.filter((row) =>
        Object.values(row)
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
  const paginatedData = sortedData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleRowClick = (row, e) => {
    if (onRowClick) onRowClick(row, e);
  };

  const handleContextMenu = (row, e) => {
    e.preventDefault();
    // Placeholder: you can show a custom context menu here
    console.log("Right-click on row:", row, contextMenu);
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

  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-100">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            onClick={() => handleSort(col.key)}
            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer"
          >
            {col.label}
            {sortConfig?.key === col.key ? (
              sortConfig.direction === "asc" ? " 🔼" : " 🔽"
            ) : null}
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
      {paginatedData.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          onClick={(e) => handleRowClick(row, e)}
          onContextMenu={(e) => handleContextMenu(row, e)}
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
                  onClick={() => action.onClick(row)}
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {action.label}
                </button>
              ))}
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>

  {/* Pagination */}
  <div className="mt-3 flex items-center justify-between">
    <button
      onClick={() => setPage((p) => Math.max(p - 1, 1))}
      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
    >
      Prev
    </button>
    <span className="text-sm text-gray-600">
      Page {page} of {Math.ceil(sortedData.length / pageSize)}
    </span>
    <button
      onClick={() =>
        setPage((p) =>
          Math.min(p + 1, Math.ceil(sortedData.length / pageSize))
        )
      }
      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
    >
      Next
    </button>

    <select
      value={pageSize}
      onChange={(e) => setPageSize(Number(e.target.value))}
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
