import React, { useState, useEffect } from "react";
import CustomTable from "../../../../components/CustomTable";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import usersConfig from "./users.config.json";
import { fetchAllUsers, blockUser, unblockUser } from "../../../../services/adminService";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAllUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        setError("Failed to load users");
      }
    } catch (err) {
      setError(err.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAction = async (action, row) => {
    try {
      if (action === "Block") {
        const res = await blockUser(row.id);
        alert(res.message);
      } else if (action === "Unblock") {
        const res = await unblockUser(row.id);
        alert(res.message);
      }
      loadUsers(); // refresh table
    } catch (err) {
      alert(err.message || "Action failed");
    }
  };


  const actions = [
    {
      label: "Block",
      icon: <FiTrash2 />,
      onClick: (row) => handleAction("Block", row),
    },
    {
      label: "Unblock",
      icon: <FiEdit />,
      onClick: (row) => handleAction("Unblock", row),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow h-[100%]">
      <h1 className="text-xl font-semibold mb-3 text-gray-800">Users Management</h1>
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <CustomTable
          columns={usersConfig.columns}
          data={users}
          actions={actions}
          defaultPageSize={5}
          onRowClick={(row) => console.log("Row clicked:", row)}
        />
      )}
    </div>
  );
};

export default UsersTable;
