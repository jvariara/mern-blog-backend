import express from "express";
import { authGuard } from "../middleware/authMiddleware";
import { createComment } from "../controllers/commentControllers";

const router = express.Router();

// API endpoint
router.post("/", authGuard, createComment);

export default router;
