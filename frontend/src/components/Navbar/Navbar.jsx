import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell, Mail } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import Notifications from "./Notifications";
import { getNotifications, markAllAsRead } from "../../api/notification";
import { getUnreadMessages } from "../../api/user";

const Navbar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Fetch notifications
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
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch unread messages
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await getUnreadMessages();
        setUnreadMessages(response.data.unread_count);
      } catch (err) {
        console.error("Error fetching unread messages:", err);
      }
    };
    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mark notifications as read when dropdown opens
  useEffect(() => {
    if (showNotifications) {
      markAllAsRead()
        .then(() =>
          setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
          )
        )
        .catch((err) => console.error("Error marking as read:", err));
    }
  }, [showNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="flex items-center justify-end gap-6 px-6 py-4 bg-white shadow-md relative">
      <button
        onClick={() => navigate("/users")}
        className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer transition"
      >
        Users
      </button>

      <button
        onClick={() => navigate("/")}
        className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer transition"
      >
        Posts
      </button>

      {/* Inbox (Chat) button */}
      <div className="relative">
        <button
          onClick={() => navigate("/conversations")}
          className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer transition relative"
        >
          {unreadMessages > 0 ? (
            <Mail className="w-6 h-6 text-blue-600 mr-1" />
          ) : (
            <Mail className="w-6 h-6 mr-1" />
          )}
          Inbox

          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
              {unreadMessages}
            </span>
          )}
        </button>
      </div>

      <Link
        to="/createpost"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer transition"
      >
        New Post
      </Link>

      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition relative"
        >
          {unreadCount > 0 ? (
            <Bell className="w-6 h-6 text-blue-600" />
          ) : (
            <Bell className="w-6 h-6 text-gray-700" />
          )}

          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border p-3 z-50">
            <Notifications notifications={notifications} />
          </div>
        )}
      </div>

      <ProfileMenu />
    </nav>
  );
};

export default Navbar;
