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
      {/* Logo / Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
      >
        {/* <img
          src="https://via.placeholder.com/40" // Replace with actual user image if available
          alt="profile"
          className="w-8 h-8 rounded-full"
        /> */}
        <span className="font-medium text-gray-700">Menu</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
          <ul>
            <li>
              <button
                onClick={() => navigate("/my_profile")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                My Profile
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
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
