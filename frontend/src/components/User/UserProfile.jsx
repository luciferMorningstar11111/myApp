import React, { useEffect, useState } from "react";
import { myProfile, unblockUser } from "../../api/user";

const UserProfile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [modalList, setModalList] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await myProfile(userId);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const handleUnblock = async (userId, blockId) => {
    try {
      await unblockUser(userId, blockId);
      setModalList((prev) => prev.filter((u) => u.id !== userId));
      fetchProfile();
    } catch (err) {
      console.error("Failed to unblock user:", err);
    }
  };

  const openModal = (list = [], title) => {
    setModalList(list);
    setModalTitle(title);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalList([]);
    setModalTitle("");
  };

  if (!profile) return <p className="text-center mt-6 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      {/* User Info */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
          {profile.current_user?.name?.charAt(0) || "U"}
        </div>
        <h2 className="text-2xl font-semibold mt-3">{profile.current_user?.name}</h2>
        <p className="text-gray-500">{profile.current_user?.email}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around mt-6">
        <button
          onClick={() => openModal(profile.followers || [], "Followers")}
          className="flex flex-col items-center hover:text-blue-600"
        >
          <span className="font-bold text-lg">{profile.followers?.length || 0}</span>
          <span className="text-sm text-gray-500">Followers</span>
        </button>

        <button
          onClick={() => openModal(profile.following || [], "Following")}
          className="flex flex-col items-center hover:text-blue-600"
        >
          <span className="font-bold text-lg">{profile.following?.length || 0}</span>
          <span className="text-sm text-gray-500">Following</span>
        </button>

        <button
          onClick={() => openModal(profile.blocked_users || [], "Blocked Users")}
          className="flex flex-col items-center hover:text-red-600"
        >
          <span className="font-bold text-lg">{profile.blocked_users?.length || 0}</span>
          <span className="text-sm text-gray-500">Blocked</span>
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg p-5 relative">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>

            <h3 className="text-lg font-bold mb-4">{modalTitle}</h3>
            <ul className="max-h-64 overflow-y-auto space-y-2">
              {modalList.length === 0 ? (
                <li className="text-gray-500 text-center py-6">No users found</li>
              ) : (
                modalList.map((u) => (
                  <li
                    key={u.id}
                    className="flex justify-between items-center border-b last:border-none pb-2"
                  >
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>

                    {modalTitle === "Blocked Users" && (
                      <button
                        onClick={() => handleUnblock(u.id, u.block_id)}
                        className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                      >
                        Unblock
                      </button>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
