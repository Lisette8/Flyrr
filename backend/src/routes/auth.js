import express, { Router } from "express"
import { signup, login, logout, updateProfile } from "../controllers/authController.js";
import {verifyAuth} from "../middlewares/authMiddleware.js"
import {ArcjetVerif} from "../middlewares/arcjetMiddleware.js"

const router = express.Router();

//before we call any method in any route , the following method must be called first and verifiedUser
//we put it here to avoid repeating it in every route
router.use(ArcjetVerif)


//get
router.get("/checkUserAuth", verifyAuth , (req,res) => res.status(200).json(req.user))

//post
router.post("/signup",signup);
router.post("/login", login)
router.post("/logout",logout)

//put
router.put("/updateProfile", verifyAuth ,updateProfile)




export default router;