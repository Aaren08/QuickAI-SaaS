import express from "express";
import cors from "cors";
import "dotenv/config";
import colors from "colors";
import { clerkMiddleware, requireAuth } from "@clerk/express";

const app = express();

app.use(express.json());
app.use(cors());

// MIDDLEWARE
app.use(clerkMiddleware());
app.use(requireAuth);

app.get("/", (req, res) => res.send("Server is running!"));

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgCyan.italic);
});
