import arj from "../lib/arcjet.js"
import { isSpoofedBot } from "@arcjet/inspect";



const ArcjetVerif = async (req, res, next) =>{
    try{
        const decision = await arj.protect(req)

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({message: "Too many requests"})
            }
            else if(decision.reason.isBot()){
                return res.status(403).json({message: "Bot detected"})
            }
            else{
                return res.status(403).json({message: "access denied, contact support"})
            }
        }

        //check for spoofed bot (a bot that acts like a human) they're hard to detect.
        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({message: "Spoofed bot detected "})
        }

        next();   
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: "Internal server error"})
        next()
    }
}



export {ArcjetVerif}