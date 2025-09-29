import express from "express";
import cors from "cors";
import "dotenv/config";
import colors from "colors";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// CONNECT CLOUDINARY
await connectCloudinary();

app.use(express.json());
app.use(cors());

// MIDDLEWARE
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("Server is running!"));

// AUTH
app.use(requireAuth());

// ROUTES
app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgCyan.italic);
});
