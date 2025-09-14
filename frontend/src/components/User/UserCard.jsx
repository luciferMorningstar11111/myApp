// src/components/UserCard/UserCard.jsx
import React, { useState } from "react";
import {
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
  startConversation,
} from "../../api/user";

const UserCard = ({ user, setUsers }) => {
  const {
    id,
    name,
    email,
    followers,
    following,
    current_user_id: currentUserId,
    is_following,
    is_blocked,
    block_id,
    is_public,
    request_status,
  } = user;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalList, setModalList] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [blocked, setBlocked] = useState(is_blocked);
  const [blockId, setBlockId] = useState(block_id);

  // Local state for follow/request status to update menu dynamically
  const [followingStatus, setFollowingStatus] = useState({
    is_following,
    request_status,
  });

  // ✅ Start chat handler
  const handleStartChat = async (userId) => {
    try {
      const response = await startConversation(userId);
      const convoId = response.conversation_id;
      window.location.href = `/conversations/${convoId}`;
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

const handleFollowOrRequest = async (id, currentlyFollowing, isPublic, requestStatus) => {
  try {
    if (isPublic) {
      // Public account → directly follow/unfollow
      if (currentlyFollowing) {
        await unfollowUser(id);
      } else {
        await followUser(id);
      }

      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === id
            ? {
                ...u,
                followers: currentlyFollowing
                  ? u.followers.filter(f => f.id !== currentUserId)
                  : [...u.followers, { id: currentUserId, name: "You" }],
                is_following: !currentlyFollowing,
              }
            : u
        )
      );

      setFollowingStatus(prev => ({
        ...prev,
        is_following: !currentlyFollowing,
      }));
    } else {
      // Private account
      if (!requestStatus) {
        // No request → send follow request
        await followUser(id);
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.id === id ? { ...u, request_status: "pending" } : u
          )
        );
        setFollowingStatus({ is_following: false, request_status: "pending" });
      } else if (requestStatus === "accepted") {
        // Already accepted → unfollow private user
        await unfollowUser(id);
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.id === id
              ? {
                  ...u,
                  request_status: null,
                  followers: u.followers.filter(f => f.id !== currentUserId),
                  is_following: false,
                }
              : u
          )
        );
        setFollowingStatus({ is_following: false, request_status: null });
      } else if (requestStatus === "pending") {
        // Optional: Cancel pending request
        await unfollowUser(id); // assuming backend cancels request
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.id === id
              ? { ...u, request_status: null }
              : u
          )
        );
        setFollowingStatus({ is_following: false, request_status: null });
      }
    }
  } catch (error) {
    console.error("Error handling follow/request:", error);
  }
  setMenuOpen(false);
};


  // ✅ Block/unblock user
  const handleBlock = async (id, currentlyBlocked) => {
    try {
      if (currentlyBlocked) {
        await unblockUser(id, blockId);
        setBlocked(false);
        setBlockId(null);
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === id ? { ...u, is_blocked: false, block_id: null } : u
          )
        );
      } else {
        const response = await blockUser(id);
        setBlocked(true);
        setBlockId(response.data.block_id);
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === id
              ? { ...u, is_blocked: true, block_id: response.data.block_id }
              : u
          )
        );
      }
    } catch (error) {
      console.error("Error blocking/unblocking:", error);
    }
    setMenuOpen(false);
  };

  // ✅ Open modal for followers/following
  const openModal = (title, list) => {
    setModalTitle(title);
    setModalList(list);
    setModalOpen(true);
  };

  return (
    <div
      className={`bg-white shadow-md rounded-2xl p-4 mb-4 transition ${
        blocked ? "opacity-50" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            {name.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">{name}</h2>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-600 hover:text-gray-900 text-xl"
          >
            ⋮
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-50">
              <ul className="py-1 text-gray-700">
                {!blocked && (
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleStartChat(id)}
                  >
                    💬 Start Chat
                  </li>
                )}
                {!blocked && (
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      handleFollowOrRequest(
                        id,
                        followingStatus.is_following,
                        is_public,
                        followingStatus.request_status
                      )
                    }
                  >
                    {is_public
                      ? followingStatus.is_following
                        ? "Unfollow"
                        : "Follow"
                      : followingStatus.request_status === "pending"
                      ? "Request Sent"
                      : followingStatus.request_status === "accepted"
                      ? "Unfollow"
                      : "Send Request"}
                  </li>
                )}
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                  onClick={() => handleBlock(id, blocked)}
                >
                  {blocked ? "Unblock" : "Block"}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Followers / Following */}
      <div className="mt-4 flex gap-3">
        <button
          className="px-3 py-1 text-sm rounded-full bg-green-500 text-white hover:bg-green-600"
          onClick={() => openModal("Followers", followers)}
          disabled={blocked}
        >
          Followers: {followers.length}
        </button>
        <button
          className="px-3 py-1 text-sm rounded-full bg-yellow-500 text-white hover:bg-yellow-600"
          onClick={() => openModal("Following", following)}
          disabled={blocked}
        >
          Following: {following.length}
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-5 w-80 relative shadow-lg">
            <h3 className="text-lg font-semibold mb-3">{modalTitle}</h3>
            <ul className="max-h-64 overflow-y-auto">
              {modalList.length === 0 ? (
                <li className="text-gray-500 text-sm">No users</li>
              ) : (
                modalList.map((u) => (
                  <li
                    key={u.id}
                    className="py-1 px-2 hover:bg-gray-50 rounded-md"
                  >
                    {u.name}
                  </li>
                ))
              )}
            </ul>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setModalOpen(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
