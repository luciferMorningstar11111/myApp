// src/api/posts.js
import api from "./axiosInstance";

export const myPosts = () => api.get("/posts");

export const createPost = (postData) => api.post("/posts", postData);

export const getPost = (id) => api.get(`/posts/${id}`);

export const updatePost = (id, postData) => api.put(`/posts/${id}`, postData);

export const deletePost = (id) => api.delete(`/posts/${id}`);
