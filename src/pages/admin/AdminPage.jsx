// pages/admin/AdminPage.js
import React from "react";
import CustomTable from "../../components/CustomTable";
import AdminHeader from "./AdminHeader";

const AdminPage = () => {
  // Demo columns
  const columns = [
    { key: "id", label: "ID" },
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ];

  // Demo data
  const data = [
    { id: 1, fullName: "Samual Badri", email: "samual@example.com", role: "admin" },
    { id: 2, fullName: "Rahul Gadekar", email: "rahul@example.com", role: "user" },
    { id: 3, fullName: "Jane Doe", email: "jane@example.com", role: "moderator" },
    { id: 4, fullName: "John Smith", email: "john@example.com", role: "user" },
  ];

  // Demo actions
  const actions = [
    { label: "Edit", onClick: (row) => alert(`Edit ${row.fullName}`) },
    { label: "Delete", onClick: (row) => alert(`Delete ${row.fullName}`) },
  ];

  // Demo row click
  const handleRowClick = (row) => {
    console.log("Clicked row:", row);
  };

  return (
    <div>
     <AdminHeader/>

      <CustomTable
        columns={columns}
        data={data}
        actions={actions}
        onRowClick={handleRowClick}
        defaultPageSize={2} // for demo pagination
      />
    </div>
  );
};

export default AdminPage;
