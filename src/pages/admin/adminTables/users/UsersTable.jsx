import React, { useState, useEffect } from "react";
import CustomTable from "../../../../components/CustomTable";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import usersConfig from "./users.config.json";

const UsersTable = () => {
  const [users, setUsers] = useState([]);

  // ✅ Example: Replace this with API call later
  useEffect(() => {
    setUsers([
      { id: 1, full_name: "Rahul Gadekar", email: "rahul@example.com", role: "Admin", is_active: true },
      { id: 2, full_name: "Jane Doe", email: "jane@example.com", role: "User", is_active: false },
      { id: 3, full_name: "John Smith", email: "john@example.com", role: "Moderator", is_active: true }
    ]);
  }, []);

  // ✅ Convert icon names from config to actual React components
  const actionIcons = {
    FiEdit: <FiEdit />,
    FiTrash2: <FiTrash2 />
  };

  const actions = usersConfig.actions.map((a) => ({
    ...a,
    icon: actionIcons[a.icon],
    onClick: (row) => handleAction(a.label, row)
  }));

  const handleAction = (action, row) => {
    if (action === "Edit") {
      alert(`Editing ${row.full_name}`);
    } else if (action === "Delete") {
      alert(`Deleting ${row.full_name}`);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow h-[100%]">
      <h1 className="text-xl font-semibold mb-3 text-gray-800">Users Management</h1>
      <CustomTable
        columns={usersConfig.columns}
        data={users}
        actions={actions}
        defaultPageSize={5}
        onRowClick={(row) => console.log("Row clicked:", row)}
      />
    </div>
  );
};

export default UsersTable;
