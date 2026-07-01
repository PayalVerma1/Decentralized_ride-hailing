import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = Router();

router.use(protect);

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
