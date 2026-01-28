import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  toggleCommentReaction,
} from "../controllers/postController.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";
import { ArcjetVerif } from "../middlewares/arcjetMiddleware.js";

const router = express.Router();

// Apply Arcjet middleware to all routes
// Temporarily disabled for development
// router.use(ArcjetVerif);

// All routes require authentication
router.use(verifyAuth);

// Post CRUD
router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/user/:username", getPostsByUser); // Must come before /:id
router.get("/:id", getPostById);
router.delete("/:id", deletePost);

// Post interactions
router.post("/:id/like", toggleLike);
router.post("/:id/comment", addComment);
router.delete("/:id/comment/:commentId", deleteComment);
router.post("/:postId/comment/:commentId/react", toggleCommentReaction);

export default router;
