import express, { Router } from "express"
import { signup, login, logout, updateProfile } from "../controllers/authController.js";
import {verifyAuth} from "../middlewares/authMiddleware.js"

const router = express.Router();

//get
router.get("/checkUserAuth", verifyAuth , (req,res) => res.status(200).json(req.user))

//post
router.post("/signup",signup);
router.post("/login",login)
router.post("/logout",logout)

//put
router.put("/updateProfile", verifyAuth ,updateProfile)




export default router;