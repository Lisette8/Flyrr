import express from "express";
import { verifyAuth } from "../middlewares/authMiddleware.js";
import { getUserNotifications, markNotificationAsRead, deleteNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.use(verifyAuth);

router.get("/", getUserNotifications);
router.put("/:id/read", markNotificationAsRead);
router.delete("/:id", deleteNotification);

export default router;
