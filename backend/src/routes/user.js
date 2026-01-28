import express from "express";
import { searchUsers } from "../controllers/userController.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyAuth);

router.get("/search", searchUsers);

export default router;
