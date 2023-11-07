import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controllers/postControllers";
import { adminGuard, authGuard } from "../middleware/authMiddleware";

const router = express.Router();

// API endpoint
// adminGuard is used to check if user is an admin so they can create a post
router.route("/").get(getAllPosts).post(authGuard, adminGuard, createPost);
router
  .route("/:slug")
  .put(authGuard, adminGuard, updatePost)
  .delete(authGuard, adminGuard, deletePost)
  .get(getPost);

export default router;
