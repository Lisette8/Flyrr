import express from "express"
import dotenv from "dotenv"
import path from "path"
import cors from "cors"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import { createServer } from "http"
import { Server } from "socket.io"

import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/post.js"
import messageRoutes from "./routes/message.js"
import userRoutes from "./routes/user.js"
import notificationRoutes from "./routes/notification.js"
import { initializeSocket } from "./socket/socketHandlers.js"

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? true : ["http://localhost:5173"],
        credentials: true
    }
});

const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

// Initialize Socket.IO
initializeSocket(io);


// CORS configuration
let currentRoad;
if(process.env.NODE_ENV === "production"){
    currentRoad = "https://flyrr.onrender.com";
}
else{
    currentRoad = "http://localhost:5173";
}
app.use(cors({
    
    origin: currentRoad,
    credentials: true
}));



app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

//hedheya el static backend 7atineh fel dossier mta3 el dist eli hwa fel production phase yodhher ba3d el deployment...
//if (process.env.NODE_ENV === "production") {
//    app.use(express.static(path.join(__dirname, "../frontend/dist")));
//
//    app.get(/.*/, (_, res) => { //if i don't want to use the req (request) i put "_" instead
//        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//    })
//
//}



httpServer.listen(PORT, () => {
    console.log("this backend is running under port: " + PORT);
    connectDB();
}
);
