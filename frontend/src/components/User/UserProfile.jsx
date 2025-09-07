import React, { useEffect, useState } from "react";
import { myProfile, updateVisibility } from "../../api/user";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalList, setModalList] = useState([]);
  const [isPublic, setIsPublic] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await myProfile(); // API helper
      setProfile(response.data.current_user);
      
      setIsPublic(response.data.current_user.is_public);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleVisibilityChange = async () => {
    const newVisibility = !isPublic;
    setIsPublic(newVisibility); // optimistic UI
    try {
      await updateVisibility(newVisibility);
    } catch (error) {
      console.error("Failed to update visibility:", error);
      setIsPublic(!newVisibility); // revert on error
    }
  };

  const openModal = (title, list) => {
    setModalTitle(title);
    setModalList(list);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalTitle("");
    setModalList([]);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="text-center mt-6 text-gray-500">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">My Profile</h1>

      <div className="mb-6 text-center">
        <p className="text-lg font-semibold">{profile.name}</p>
        <p className="text-gray-500">{profile.email}</p>
      </div>

      {/* Profile Visibility Section */}
      <div className="flex items-center justify-between mb-6 border rounded-lg p-4 bg-gray-50">
        <div>
          <p className="font-medium text-gray-800">Profile Visibility</p>
          <p className="text-xs text-gray-500">
            {isPublic ? "Your profile is Public" : "Your profile is Private"}
          </p>
        </div>
        <button
          onClick={handleVisibilityChange}
          className={`w-14 h-7 flex items-center rounded-full transition duration-300 ${
            isPublic ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition duration-300 ${
              isPublic ? "translate-x-7" : "translate-x-0"
            }`}
          ></div>
        </button>
      </div>

      {/* Followers & Following Buttons */}
      <div className="flex justify-around mb-4">
        <button
          className="text-blue-600 font-semibold hover:underline"
          onClick={() => openModal("Followers", profile.followers)}
        >
          Followers ({profile.followers?.length||0})
        </button>
        <button
          className="text-blue-600 font-semibold hover:underline"
          onClick={() => openModal("Following", profile.following)}
        >
          Following ({profile.following?.length ||0})
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-5 w-80 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-3">{modalTitle}</h3>
            <ul className="max-h-64 overflow-y-auto">
              {modalList.length === 0 ? (
                <li className="text-gray-500">No users</li>
              ) : (
                modalList.map((u) => (
                  <li
                    key={u.id}
                    className="p-2 border-b last:border-none hover:bg-gray-100 rounded"
                  >
                    <p className="font-semibold">{u.name}</p>
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
