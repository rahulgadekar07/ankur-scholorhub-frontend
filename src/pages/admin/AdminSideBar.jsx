import React from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { NavLink } from 'react-router-dom';

const AdminSideBar = ({ toggleCollapse, isCollapsed }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Settings', path: '/admin/settings' },
    { name: 'Logout', path: '/logout' },
  ];

  return (
    <div
      className={`h-full bg-gray-900 text-white p-4 transition-all duration-300 shadow-lg
        ${isCollapsed ? 'w-[5vw] min-w-[60px] max-w-[80px]' : 'w-[20vw] min-w-[200px] max-w-[240px]'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold text-blue-700 ${isCollapsed ? 'hidden' : 'block'}`}>
          Admin Menu
        </h2>
        <button
          className="focus:outline-none hover:text-blue-700 transition-colors duration-200"
          onClick={toggleCollapse}
        >
          {isCollapsed ? <AiOutlineMenu size={22} /> : <HiOutlineMenuAlt2 size={22} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`${isCollapsed ? 'hidden' : 'block'}`}>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md transition-all duration-200 
                  ${isActive ? 'bg-blue-700 text-white' : 'hover:bg-gray-50 hover:text-blue-700'}`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSideBar;
