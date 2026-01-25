import express, { Router } from "express"


const router = express.Router();


router.get("/signup",(req,res) => {
    res.send("signup is working fine");
})

router.get("/login",(req,res) => {
    res.send("login is working fine");
})

router.get("/logout",(req,res) => {
    res.send("logout is working fine");
})

export default router;