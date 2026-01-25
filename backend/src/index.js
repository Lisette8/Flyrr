import express from "express"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.js"

const app = express();

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);


app.listen(PORT, () => console.log("this backend is running under port: " + PORT)); 