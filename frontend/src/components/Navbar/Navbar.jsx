import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import Notifications from "./Notifications";
import { getNotifications, markAllAsRead } from "../../api/notification";

const Navbar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // 🔹 Fetch notifications on mount + poll every 30s
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  // 🔹 Mark all as read when dropdown opens
  useEffect(() => {
    if (showNotifications) {
      markAllAsRead()
        .then(() => {
          setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
          );
        })
        .catch((err) => console.error("Error marking as read:", err));
    }
  }, [showNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="flex items-end gap-8 justify-end px-6 py-4 bg-white shadow-md relative">
      {/* Navigation buttons */}
      <button
        onClick={() => navigate("/users")}
        className="flex items-center text-gray-700 hover:text-gray-900"
      >
        Users
      </button>

      <button
        onClick={() => navigate("/")}
        className="flex items-center text-gray-700 hover:text-gray-900"
      >
        Posts
      </button>

      <Link
        to="/createpost"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        New Post
      </Link>

      {/* 🔔 Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-full hover:bg-gray-100"
        >
          {unreadCount > 0 ? (
            <Bell className="w-6 h-6 text-blue-600" /> // Highlighted bell
          ) : (
            <Bell className="w-6 h-6 text-gray-700" /> // Normal bell
          )}

          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown panel */}
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border p-3">
            <Notifications notifications={notifications} />
          </div>
        )}
      </div>

      <ProfileMenu />
    </nav>
  );
};

export default Navbar;
