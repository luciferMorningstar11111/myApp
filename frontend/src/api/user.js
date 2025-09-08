// src/api/users.js
import api from "./axiosInstance";

const getAllUsers = async () => {
  try {
    const response = await api.get("/api/v1/users"); 
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

const getUser = async (id) => {
  try {
    const response = await api.get(`/api/v1/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

const getFollowers = (id) => api.get(`/api/v1/users/${id}/followers`);

const getFollowing = (id) => api.get(`/api/v1/users/${id}/following`);

const followUser = (id) => api.post(`/api/v1/users/${id}/follow`);

const unfollowUser = (id) => api.delete(`/api/v1/users/${id}/unfollow`);

const myProfile = () => api.get("/api/v1/my_profile");

const blockUser = (id) => api.post(`/api/v1/users/${id}/blocks`);

const unblockUser = (userId,blockId) => api.delete(`/api/v1/users/${userId}/blocks/${blockId}`);

export { getAllUsers, getUser, getFollowers, getFollowing, followUser, unfollowUser,myProfile , blockUser, unblockUser};
