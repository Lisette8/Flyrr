import Notification from "../entities/Notification.js";

const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ recipient: userId })
            .populate("sender", "username profilePic")
            .populate("post", "text image") // Optional: populate post details if needed
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (id === "all") {
            await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
            return res.status(200).json({ message: "All notifications marked as read" });
        }

        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        if (notification.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json(notification);
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        if (notification.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await notification.deleteOne();
        res.status(200).json({ message: "Notification deleted" });

    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { getUserNotifications, markNotificationAsRead, deleteNotification };
