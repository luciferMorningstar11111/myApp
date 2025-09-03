import React, { useState } from "react";
import { followUser, unfollowUser } from "../../api/user";

const UserCard = ({ user, setUsers }) => {
  const { name, email, followers, following, current_user_id: currentUserId, is_following } = user;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalList, setModalList] = useState([]);

  const handleFollow = async (id, currentlyFollowing) => {
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

          return { ...u, followers: updatedFollowers, is_following: !currentlyFollowing };
        }
        return u;
      })
    );
  };

  const openModal = (title, list) => {
    setModalTitle(title);
    setModalList(list);
    setModalOpen(true);
  };

  return (
    <div className="border-b border-black p-3">
      <div className="flex justify-between items-center">
        <h2>{name}</h2>
        <button
          className={`${
            is_following ? "bg-red-700" : "bg-blue-700"
          } rounded-2xl px-3 py-1 text-white`}
          onClick={() => handleFollow(user.id, is_following)}
        >
          {is_following ? "Unfollow" : "Follow"}
        </button>
      </div>

      <p>{email}</p>

      <div className="mt-2 flex gap-2">
        <button
          className="bg-green-500 rounded-xl px-2 py-1"
          onClick={() => openModal("Followers", followers)}
        >
          Followers: {followers.length}
        </button>

        <button
          className="bg-yellow-500 rounded-xl px-2 py-1"
          onClick={() => openModal("Following", following)}
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
