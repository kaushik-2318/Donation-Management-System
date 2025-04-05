const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
};

const updateNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        if (notification.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        notification.isRead = true;
        await notification.save();
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification", error: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        if (notification.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await notification.remove();
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notification", error: error.message });
    }
};

module.exports = { getNotifications, updateNotification, deleteNotification };