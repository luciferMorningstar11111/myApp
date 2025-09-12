import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const InboxPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const res = await api.get("/conversations");
        console.log("Fetched conversations:", res.data);
        setConversations(res.data);
      } catch (err) {
        console.error("Error fetching inbox:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConvos();
  }, []);

  if (loading) return <p className="p-4">Loading inbox...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4">Inbox</h2>

      {conversations.length === 0 ? (
        <p className="text-gray-500">No conversations yet</p>
      ) : (
        <ul className="divide-y border rounded-lg">
          {conversations.map((c) => {
            const otherUsers = c.users.filter(
              (u) => u.id !== window.currentUser?.id
            );
            const title = otherUsers.map((u) => u.name).join(", ");

            // Highlight if there are unread messages
            const highlightClass =
              c.unread_count && c.unread_count > 0
                ? "bg-blue-50 font-semibold"
                : "";

            return (
              <li
                key={c.id}
                className={`p-3 hover:bg-gray-50 cursor-pointer ${highlightClass}`}
                onClick={() => navigate(`/conversations/${c.id}`)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{title || "Conversation"}</div>
                    {c.last_message ? (
                      <div className="text-sm text-gray-600">
                        <strong>{c.last_message.user.name}:</strong>{" "}
                        {c.last_message.content}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">No messages yet</div>
                    )}
                  </div>

                  {/* Unread count badge positioned at right middle */}
                  {c.unread_count > 0 && (
                    <span className="inline-block bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {c.unread_count}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default InboxPage;
