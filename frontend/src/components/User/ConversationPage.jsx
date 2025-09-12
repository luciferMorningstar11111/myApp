import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const ConversationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");

  // Fetch conversation + mark unread messages as read
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await api.get(`/conversations/${id}`);
        setConversation(res.data);

        // Mark all unread messages as read for the current user
        await api.post(`/conversations/${id}/mark_as_read`);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversation();
  }, [id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await api.post(`/conversations/${id}/messages`, {
        content: newMessage,
      });
      setConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, res.data],
      }));
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) return <p className="p-4">Loading conversation...</p>;
  if (!conversation) return <p className="p-4">Conversation not found</p>;

  // Highlight container if unread_count > 0
  const containerHighlight =
    conversation.unread_count && conversation.unread_count > 0
      ? "bg-blue-50"
      : "";

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4">Conversation</h2>

      <div
        className={`border rounded-lg p-4 h-80 overflow-y-auto mb-4 ${containerHighlight}`}
      >
        {conversation.messages.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          conversation.messages.map((msg) => (
            <div key={msg.id} className="mb-2 p-2 rounded">
              <span className="font-semibold">{msg.user.name}:</span>{" "}
              <span>{msg.content}</span>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ConversationPage;
