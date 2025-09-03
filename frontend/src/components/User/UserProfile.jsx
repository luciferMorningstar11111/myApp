import React, { useEffect, useState } from "react";
import { myProfile } from "../../api/user";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalList, setModalList] = useState([]);

  const fetchProfile = async () => {
    try {
      const response = await myProfile(); // API helper handles URL
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
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
    return <div className="text-center mt-6 text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">My Profile</h1>

      <div className="mb-6 text-center">
        <p className="text-lg font-semibold">{profile.name}</p>
        <p className="text-gray-500">{profile.email}</p>
      </div>

      {/* Followers & Following Buttons */}
      <div className="flex justify-around mb-4">
        <button
          className="text-blue-600 font-semibold hover:underline"
          onClick={() => openModal("Followers", profile.followers)}
        >
          Followers ({profile.followers.length})
        </button>
        <button
          className="text-blue-600 font-semibold hover:underline"
          onClick={() => openModal("Following", profile.following)}
        >
          Following ({profile.following.length})
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
