import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/signin");
  };

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300"
      >
        <span className="font-medium text-gray-700">Menu</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 p-2">
          <ul>
            {/* My Profile */}
            <li>
              <button
                onClick={() => navigate("/my_profile")}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                My Profile
              </button>
            </li>

            {/* Logout */}
            <li className="border-t mt-2">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 rounded-lg"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
