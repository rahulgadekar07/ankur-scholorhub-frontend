import React, { useState } from "react";
import CustomTable from "../../components/CustomTable";
import AdminHeader from "./AdminHeader";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import AdminSideBar from "./AdminSideBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UsersTable from "./adminTables/users/UsersTable";

const AdminPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ];

  const data = [
    {
      id: 1,
      fullName: "Samual Badri",
      email: "samual@example.com",
      role: "admin",
    },
    {
      id: 2,
      fullName: "Rahul Gadekar",
      email: "rahul@example.com",
      role: "user",
    },
    {
      id: 3,
      fullName: "Jane Doe",
      email: "jane@example.com",
      role: "moderator",
    },
    { id: 4, fullName: "John Smith", email: "john@example.com", role: "user" },
    {
      id: 5,
      fullName: "Alice Johnson",
      email: "alicejohnson@example.com",
      role: "admin",
    },
  ];

  const actions = [
    {
      label: "Edit",
      icon: <FiEdit />,
      onClick: (row) => alert(`Edit ${row.fullName}`),
    },
    {
      label: "Delete",
      icon: <FiTrash2 />,
      onClick: (row) => alert(`Delete ${row.fullName}`),
    },
  ];

  const handleRowClick = (row) => {
    console.log("Clicked row:", row);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      {/* Header */}
      <div className="h-[10vh] flex-shrink-0">
        <AdminHeader />
      </div>

      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden max-h-[90vh]">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ${
            isCollapsed
              ? "w-[5vw] min-w-[60px] max-w-[80px]"
              : "w-[20vw] min-w-[200px] max-w-[240px]"
          } h-full bg-gray-800`}
        >
          <AdminSideBar
            toggleCollapse={toggleCollapse}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Main Table Content */}
        <div className="flex-1 bg-gray-100 text-black overflow-auto ">
          <Routes>
            <Route path="dashboard" element={<div>Dasahboard</div>} />
            <Route path="users" element={<UsersTable/>} />
            <Route
              path="settings"
              element={
                <CustomTable
                  columns={columns}
                  data={data}
                  actions={actions}
                  onRowClick={handleRowClick}
                  defaultPageSize={5}
                />
              }
            />
            <Route path="logout" element={<div>Logout</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
