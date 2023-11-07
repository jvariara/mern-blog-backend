import express from "express";
import {
  loginUser,
  registerUser,
  updateProfile,
  updateProflePicture,
  userProfile,
} from "../controllers/userControllers";
import { authGuard } from "../middleware/authMiddleware";

const router = express.Router();

// API endpoint
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authGuard, userProfile);
router.put("/update-profile", authGuard, updateProfile);
router.put("/update-profile-picture", authGuard, updateProflePicture)

export default router;
