import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";
import {
  errorResponserHandler,
  invalidPathHandler,
} from "./middleware/errorHandler";

// Routes
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes"
import commentRoutes from "./routes/commentRoutes"

// configure env file
dotenv.config();
connectDB();

// create an instance of express packge
const app = express();
// Use middleware => express.json()
app.use(express.json());

// Route and controller
// Controller takes the req and res
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// if we hit this path, go through the routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes)

// static assets (profile pictures)
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// attach error handler to app object
app.use(invalidPathHandler);
app.use(errorResponserHandler);

// Listen to port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
