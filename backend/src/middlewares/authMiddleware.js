import jwt from "jsonwebtoken";
import User from "../entities/User.js";
import env from "dotenv";
env.config();

const verifyAuth = async (req, res, next) => {
  try {

    //if token exists
    let token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({message: "No token found"});
    }

    //is token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({message: "Invalid token"});
    }

    //if users exists by id
    const verifiedUser = await User.findById(decoded.userId).select("-password");
    if(!verifiedUser){
        return res.status(404).json({message: "User not found"});
    }

    req.user = verifiedUser;
    next();

    
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export { verifyAuth }