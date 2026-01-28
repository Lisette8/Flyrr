import User from "../entities/User.js";

// Search users by username
const searchUsers = async (req, res) => {
  const { q } = req.query;
  const currentUserId = req.user._id;

  try {
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      username: { $regex: q, $options: "i" }, // Case-insensitive search
      _id: { $ne: currentUserId }, // Exclude current user
    })
      .select("username profilePic")
      .limit(10);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { searchUsers };
