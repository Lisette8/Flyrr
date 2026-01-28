import Post from "../entities/Post.js";
import Notification from "../entities/Notification.js";
import cloudi from "../lib/cloudinary.js";
import { getIO } from "../socket/socketHandlers.js";

// Create a new post
const createPost = async (req, res) => {
  const { text, image } = req.body;
  const userId = req.user._id;

  try {
    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Post text is required" });
    }

    if (text.length > 2000) {
      return res
        .status(400)
        .json({ message: "Post text cannot exceed 2000 characters" });
    }

    // Cannot have image without text
    if (!text && image) {
      return res
        .status(400)
        .json({ message: "Cannot post image without text" });
    }

    let imageUrl = "";
    if (image) {
      try {
        const uploadResult = await cloudi.uploader.upload(image, {
          folder: "flyrr_posts",
          resource_type: "auto",
        });
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({ message: "Failed to upload image" });
      }
    }

    const newPost = new Post({
      author: userId,
      text,
      image: imageUrl,
    });

    await newPost.save();
    await newPost.populate("author", "username profilePic");

    // Emit socket event for real-time update
    const io = getIO();
    if (io) {
      io.emit("newPost", newPost);
    }

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username profilePic")
      .populate("comments.user", "username profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single post by ID
const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id)
      .populate("author", "username profilePic")
      .populate("comments.user", "username profilePic");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get posts by user
const getPostsByUser = async (req, res) => {
  const { username } = req.params;

  try {
    const posts = await Post.find()
      .populate("author", "username profilePic")
      .populate("comments.user", "username profilePic")
      .sort({ createdAt: -1 });

    const userPosts = posts.filter(
      (post) => post.author.username === username
    );

    res.status(200).json(userPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author
    if (post.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts" });
    }

    await Post.findByIdAndDelete(id);

    // Emit socket event
    const io = getIO();
    if (io) {
      io.emit("postDeleted", { postId: id });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Toggle like on a post
const toggleLike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    await post.populate("author", "username profilePic");
    await post.populate("comments.user", "username profilePic");

    // Emit socket event
    const io = getIO();
    if (io) {
      io.emit("postLiked", {
        postId: id,
        likes: post.likes,
        likesCount: post.likes.length,
      });

      // Create notification if liked
      if (likeIndex === -1 && post.author.toString() !== userId.toString()) {
        const newNotification = new Notification({
          recipient: post.author,
          sender: userId,
          type: "like_post",
          post: id,
        });
        await newNotification.save();
        await newNotification.populate("sender", "username profilePic");
        await newNotification.populate("post", "text image");

        io.emit("newNotification", newNotification);
      }
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add comment to a post
const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user._id;

  try {
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (text.length > 500) {
      return res
        .status(400)
        .json({ message: "Comment cannot exceed 500 characters" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      user: userId,
      text: text.trim(),
    };

    post.comments.push(newComment);
    await post.save();
    await post.populate("author", "username profilePic");
    await post.populate("comments.user", "username profilePic");

    // Emit socket event
    const io = getIO();
    if (io) {
      io.emit("newComment", {
        postId: id,
        comment: post.comments[post.comments.length - 1],
        commentsCount: post.comments.length,
      });

      // Create notification
      if (post.author.toString() !== userId.toString()) {
        const newNotification = new Notification({
          recipient: post.author,
          sender: userId,
          type: "comment_post",
          post: id,
        });
        await newNotification.save();
        await newNotification.populate("sender", "username profilePic");
        await newNotification.populate("post", "text image");

        io.emit("newNotification", newNotification);
      }
    }

    res.status(201).json(post);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the comment author
    if (comment.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments" });
    }

    comment.deleteOne();
    await post.save();
    await post.populate("author", "username profilePic");
    await post.populate("comments.user", "username profilePic");

    // Emit socket event
    const io = getIO();
    if (io) {
      io.emit("commentDeleted", {
        postId: id,
        commentId,
        commentsCount: post.comments.length,
      });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Toggle reaction on a comment
const toggleCommentReaction = async (req, res) => {
  const { postId, commentId } = req.params;
  const { type } = req.body; // like, love, laugh, angry, sad
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user already reacted
    const existingReactionIndex = comment.reactions.findIndex(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingReactionIndex > -1) {
      // If same reaction type, remove it. Otherwise, update it
      if (comment.reactions[existingReactionIndex].type === type) {
        comment.reactions.splice(existingReactionIndex, 1);
      } else {
        comment.reactions[existingReactionIndex].type = type;
      }
    } else {
      // Add new reaction
      comment.reactions.push({ user: userId, type });
    }

    await post.save();
    await post.populate("author", "username profilePic");
    await post.populate("comments.user", "username profilePic");
    await post.populate("comments.reactions.user", "username profilePic");

    // Emit socket event
    const io = getIO();
    if (io) {
      io.emit("commentReaction", {
        postId,
        commentId,
        reactions: comment.reactions,
      });

      // Create notification if new reaction
      if (existingReactionIndex === -1 && comment.user.toString() !== userId.toString()) {
        const newNotification = new Notification({
          recipient: comment.user,
          sender: userId,
          type: "reaction_comment",
          post: postId,
        });
        await newNotification.save();
        await newNotification.populate("sender", "username profilePic");
        await newNotification.populate("post", "text image");

        io.emit("newNotification", newNotification);
      }
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error toggling comment reaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  toggleCommentReaction,
};
