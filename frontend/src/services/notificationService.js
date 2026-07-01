import api from "./api";

const notificationService = {
  /** Get all notifications for current user */
  getNotifications: (params) => api.get("/notifications", { params }),

  /** Mark a notification as read */
  markAsRead: (notificationId) =>
    api.put(`/notifications/${notificationId}/read`),

  /** Mark all notifications as read */
  markAllAsRead: () => api.put("/notifications/read-all"),

  /** Get unread notification count */
  getUnreadCount: () => api.get("/notifications/unread-count"),

  /** Delete a notification */
  deleteNotification: (notificationId) =>
    api.delete(`/notifications/${notificationId}`),
};

export default notificationService;
