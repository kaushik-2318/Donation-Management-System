const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

// 📌 Create Post (NGO, Receiver & admin Only)
router.post("/create", authMiddleware, createPost);

// 📌 Get All Active Posts (Public)
router.get("/", getAllPosts);

// 📌 Get a Specific Post (Public)
router.get("/:id", getPostById);

// 📌 Update a Post (Author or Admin)
router.put("/:id", authMiddleware, updatePost);

// 📌 Delete a Post (Author or Admin)
router.delete("/:id", authMiddleware, deletePost);


module.exports = router;
