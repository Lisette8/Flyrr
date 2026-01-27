import express from "express"
import dotenv from "dotenv"
import path from "path"
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.js"

dotenv.config();

const app = express();
const __dirname  = path.resolve();

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes);

//hedheya el static backend 7atineh fel dossier mta3 el dist eli hwa fel production phase yodhher ba3d el deployment...
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get(/.*/, (_,res) => { //if i don't want to use the req (request) i put "_" instead
        res.sendFile(path.join(__dirname, "../frontend" , "dist" , "index.html"));
    })

}


app.listen(PORT, () => {
    console.log("this backend is running under port: " + PORT);
    connectDB();
    }
); 