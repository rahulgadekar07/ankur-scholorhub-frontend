import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const AdminHeader = () => {
  const [fullName, setFullname] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setFullname(user.full_name || "");
    console.log("AdminHeader user:", fullName);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleDownClick = () => {
    setShowDropdown((prev) => !prev);
  };
  const handleLogout = async () => {
     try {
       await logout();
       toast.success("Logged out successfully!", { autoClose: 2000 });
       navigate("/");
     } catch (error) {
       console.error("Logout failed:", error);
     }
   };

  return (
    <div className="flex w-full bg-blue-700 text-white justify-between items-center p-4 relative">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="flex items-center relative" ref={dropdownRef}>
        <span>Welcome, {fullName}</span>
        <FiChevronDown className="ml-1 cursor-pointer" onClick={handleDownClick} />
        {showDropdown && (
          <div className="absolute right-0 mt-10 bg-white text-black rounded shadow-lg p-2 z-10">
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" >Profile</button>
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;