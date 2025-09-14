import React, { useEffect, useState } from "react";
import {
  myProfile,
  unblockUser,
  getFollowRequests,
  respondFollowRequest,
} from "../../api/user";

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
      const res = await myProfile();
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await getFollowRequests();
      openModal(res.data || [], "Follow Requests");
    } catch (err) {
      console.error("Failed to fetch follow requests:", err);
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

  const handleRequestAction = async (id, action) => {
    try {
      await respondFollowRequest(id, action); // "accepted" or "rejected"
      setModalList((prev) => prev.filter((r) => r.id !== id));
      fetchProfile();
    } catch (err) {
      console.error("Failed to update request:", err);
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

  if (!profile)
    return <p className="text-center mt-6 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      {/* User Info */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-2xl font-bold text-white shadow-md">
          {profile.current_user?.name?.charAt(0) || "U"}
        </div>
        <h2 className="text-2xl font-semibold mt-3 text-gray-800">
          {profile.current_user?.name}
        </h2>
        <p className="text-gray-500">{profile.current_user?.email}</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-center">
        <button
          onClick={() => openModal(profile.followers || [], "Followers")}
          className="p-3 rounded-lg hover:bg-blue-50 transition"
        >
          <span className="font-bold text-lg block">
            {profile.followers?.length || 0}
          </span>
          <span className="text-sm text-gray-500">Followers</span>
        </button>

        <button
          onClick={() => openModal(profile.following || [], "Following")}
          className="p-3 rounded-lg hover:bg-blue-50 transition"
        >
          <span className="font-bold text-lg block">
            {profile.following?.length || 0}
          </span>
          <span className="text-sm text-gray-500">Following</span>
        </button>

        <button
          onClick={() => openModal(profile.blocked_users || [], "Blocked Users")}
          className="p-3 rounded-lg hover:bg-red-50 transition"
        >
          <span className="font-bold text-lg block text-red-500">
            {profile.blocked_users?.length || 0}
          </span>
          <span className="text-sm text-gray-500">Blocked</span>
        </button>

        <button
          onClick={fetchRequests}
          className="p-3 rounded-lg hover:bg-green-50 transition"
        >
          <span className="font-bold text-lg block text-green-600">
            {profile.follow_requests_count || 0}
          </span>
          <span className="text-sm text-gray-500">Requests</span>
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-96 rounded-lg shadow-xl p-5 relative">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>

            <h3 className="text-lg font-bold mb-4 text-gray-800">
              {modalTitle}
            </h3>
            <ul className="max-h-64 overflow-y-auto space-y-3">
              {modalList.length === 0 ? (
                <li className="text-gray-500 text-center py-6">
                  No users found
                </li>
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

                    {modalTitle === "Follow Requests" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRequestAction(u.id, "accepted")}
                          className="text-xs text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequestAction(u.id, "rejected")}
                          className="text-xs text-white bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
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
