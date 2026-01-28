import express from "express";
import { verifyAuth } from "../middlewares/authMiddleware.js";
import { ArcjetVerif } from "../middlewares/arcjetMiddleware.js";
import { getContacts, getPartners, getMessageByUserId, sendMessage} from "../controllers/messageController.js";


const router = express.Router();

//we verif again, this is in order (that means arcjet first then auth)
router.use(ArcjetVerif, verifyAuth);


router.get("/contacts", getContacts);
router.get("/chats", getPartners);
router.get("/:id", getMessageByUserId);
router.post("/send/:id", sendMessage);





export default router;