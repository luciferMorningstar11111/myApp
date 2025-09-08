import React, { useState } from "react";
import {
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
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
    block_id, // ✅ From API
  } = user;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalList, setModalList] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [blocked, setBlocked] = useState(is_blocked);
  const [blockId, setBlockId] = useState(block_id);

  // ✅ Follow/Unfollow logic
  const handleFollow = async (id, currentlyFollowing) => {
    try {
      if (currentlyFollowing) {
        await unfollowUser(id);
      } else {
        await followUser(id);
      }

      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (u.id === id) {
            const updatedFollowers = currentlyFollowing
              ? u.followers.filter((f) => f.id !== currentUserId)
              : [...u.followers, { id: currentUserId, name: "You" }];

            return {
              ...u,
              followers: updatedFollowers,
              is_following: !currentlyFollowing,
            };
          }
          return u;
        })
      );
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    }
    setMenuOpen(false);
  };

  // ✅ Block/Unblock logic
  const handleBlock = async (id, currentlyBlocked) => {
    try {
      if (currentlyBlocked) {
  // Unblocking
  await unblockUser(id, blockId);
  setBlocked(false);
  setBlockId(null);

  setUsers((prevUsers) =>
    prevUsers.map((u) =>
      u.id === id ? { ...u, is_blocked: false, block_id: null } : u
    )
  );
} else {
  // Blocking
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

  const openModal = (title, list) => {
    setModalTitle(title);
    setModalList(list);
    setModalOpen(true);
  };

  return (
    <div
  className={`border-b border-gray-300 p-4 relative ${
    blocked ? "opacity-50" : ""
  }`}
>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">{name}</h2>
          <p className="text-gray-500">{email}</p>
        </div>

        {/* ✅ Three-dot menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-600 hover:text-black text-xl"
          >
            ⋮
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50">
              <ul className="py-1 text-gray-700">
                {/* Follow/Unfollow */}
                {!blocked && (
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleFollow(id, is_following)}
                  >
                    {is_following ? "Unfollow" : "Follow"}
                  </li>
                )}

                {/* Block/Unblock */}
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

      {/* Followers and Following */}
      <div className="mt-3 flex gap-3">
        <button
          className="bg-green-500 rounded-xl px-2 py-1 text-white text-sm"
          onClick={() => openModal("Followers", followers)}
          disabled={blocked}
        >
          Followers: {followers.length}
        </button>

        <button
          className="bg-yellow-500 rounded-xl px-2 py-1 text-white text-sm"
          onClick={() => openModal("Following", following)}
          disabled={blocked}
        >
          Following: {following.length}
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-5 w-80 relative">
            <h3 className="text-xl font-bold mb-3">{modalTitle}</h3>
            <ul className="max-h-64 overflow-y-auto">
              {modalList.length === 0 ? (
                <li className="text-gray-500">No users</li>
              ) : (
                modalList.map((u) => <li key={u.id}>{u.name}</li>)
              )}
            </ul>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
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
