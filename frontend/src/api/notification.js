import api from "./axiosInstance";

const getNotifications = () => api.get("/notifications");

const markAllAsRead = () => api.post("/notifications/mark_all_as_read");

export { getNotifications, markAllAsRead };