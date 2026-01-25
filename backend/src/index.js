import express from "express"
import dotenv from "dotenv"
import path from "path"

import authRoutes from "./routes/auth.js"

const app = express();
const __dirname  = path.resolve();

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);

//hedheya el static backend 7atineh fel dossier mta3 el dist eli hwa fel production phase yodhher ba3d el deployment...
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req,res) => { //if i don't want to use the req (request) i put "_" instead
        res.sendFile(path.join(__dirname, "../frontend" , "dist" , "index.html"));
    })

}


app.listen(PORT, () => console.log("this backend is running under port: " + PORT)); 