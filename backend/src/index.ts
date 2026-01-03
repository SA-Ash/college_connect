import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbConnect.js";
import { config } from "dotenv";
import authRouter from "./routes/auth.route.js";
import contactRouter from "./routes/contact.route.js";
import userRouter from "./routes/user.route.js";
const app = express()
config()
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
app.use(express.json());
app.use(cookieParser());
app.use("/v1/auth", authRouter);
app.use("/v1/contact", contactRouter);
app.use("/v1/user", userRouter);
const port:string|number = process.env.PORT || 8000;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
    dbConnect().then(() => {
        console.log("Connected to the database successfully.");
    }).catch((error) => {
        console.error("Database connection failed:", error);
    });
})
