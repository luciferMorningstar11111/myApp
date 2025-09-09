import api from "./axiosInstance";


const getComments = (postId) => api.get(`/posts/${postId}/comments`);


const createComment = (postId, commentData) =>
  api.post(`/posts/${postId}/comments`, commentData);


const updateComment = (postId, commentId, commentData) =>
  api.put(`/posts/${postId}/comments/${commentId}`, commentData);


const deleteComment = (postId, commentId) =>
  api.delete(`/posts/${postId}/comments/${commentId}`);

export {getComments, createComment, updateComment, deleteComment};
