import bcrypt from "bcryptjs";
import User from "../entities/User.js";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../email/emailHandler.js";
import cloudi from "../lib/cloudinary.js";


const signup = async (req,res) => {
    const {username, email, password} = req.body

    try{

        //input control
        
        //check if all the fields are filled
        if(!username || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        

        if(password.length < 6){
            return res.status(400).json({message: "password must be at least 6 characters"});
        }

        const emailVerif = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailVerif.test(email)){
            return res.status(400).json({message: "please enter a valid email"});
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });
        
        //password encryption
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        //give a unique token to each new user, that lasts for a period of time
        if (newUser) {
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);
            

            //send an email to the new user
            try{
                await sendWelcomeEmail(savedUser.email , savedUser.username)
            }
            catch(emailError){
                console.error("Error sending welcome email:", emailError);
            }

            res.status(201).json({
              _id: newUser._id,
              username: newUser.username,
              email: newUser.email,
              profilePic: newUser.profilePic,
            });
      
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }

        
      

    }
    catch(error){
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });
      // never tell the client which one is incorrect: password or email
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
  
      generateToken(user._id, res);
  
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      });


    } catch (error) {
      console.error("Error in login controller:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

const logout = (_, res) => { //req(request) is meant to require informations, in this case we don't need any that's why we used _ , res is the result we gonna return or use...q
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
};


const updateProfile = async (req, res) =>{
    try{
        const {profilePicture} = req.body;

        //make sure a profile picture is provided
        if(!profilePicture){
            return res.status(400).json({message: "Profile picture is required"})
        }


        const userId = req.user._id;
        //user presence and auth already verified in the middleware
        const uploadImage =  await cloudi.uploader.upload(profilePicture)
        const updatedUserInstance = await User.findByIdAndUpdate(userId, {profilePic: uploadImage.secure_url}, {new: true})

        res.status(200).json({
            message: "profile updated successfully",
            updatedUserInstance
        })

    }
    catch(error){
        console.error(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}



    



export {signup, login, logout, updateProfile}