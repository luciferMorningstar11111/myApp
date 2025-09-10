import React from "react";

const Notifications = ({ notifications }) => {
  if (notifications.length === 0) {
    return <p className="text-sm text-gray-500">No notifications yet</p>;
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-3 rounded-lg cursor-pointer ${
            n.read ? "bg-gray-100" : "bg-blue-50"
          }`}
        >
          <p className="text-sm">
            <span className="font-semibold">{n.actor_name}</span> {n.action} your post{" "}
            <span className="italic">"{n.post_title}"</span>
          </p>
          <p className="text-xs text-gray-500">
            {new Date(n.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
