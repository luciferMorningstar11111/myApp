import React, { useEffect, useState, useRef } from "react";
import CableApp from "../channels/consumer";

export default function ChatWindow({ conversationId, currentUser }) {
  const [conversation, setConversation] = useState(null);
  const [text, setText] = useState("");
  const subscriptionRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;

    // load initial conversation
    fetch(`/conversations/${conversationId}.json`)
      .then(r => r.json())
      .then(data => setConversation(data));

    // setup subscription
subscriptionRef.current = CableApp.cable.subscriptions.create(
  { channel: "ConversationsChannel", conversation_id: conversationId },
  {
    received(data) {
      if (data.payload) setConversation(data.payload);
    }
  }
);


    return () => {
      if (subscriptionRef.current) subscriptionRef.current.perform("unfollow");
    };
  }, [conversationId]);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    fetch(`/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector("meta[name=csrf-token]").content
      },
      body: JSON.stringify({ message: { content: text } })
    }).then((res) => {
      if (res.ok) setText("");
    });
  };

  if (!conversation) return <div>Loading chat...</div>;

  return (
    <div className="chat-window">
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              background: msg.user.id === currentUser.id ? "#e6ffe6" : "#f1f1f1",
              margin: "5px",
              padding: "5px",
              borderRadius: "6px"
            }}
          >
            <strong>{msg.user.name}</strong>: {msg.content}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "80%" }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
