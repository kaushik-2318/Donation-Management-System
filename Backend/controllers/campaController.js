const Post = require("../models/Post");
const User = require("../models/User");

const createPost = async (req, res, next) => {
  try {
    const { title, description, proofLink, targetAmount } = req.body;
    const authorId = req.user.id; // Get user ID from authentication middleware

    // ✅ Find the user
    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // ✅ Ensure only NGOs & receivers can create posts
    if (author.role === "donor") {
      return next(
        new Error("Donors cannot create donation requests.")
      );
    }

    // ✅ Validate required fields
    if (!title || !description) {
      return next(new Error("Title and description are required."));
    }

    // ✅ Ensure `targetAmount` is required for both NGOs & receivers
    if (!targetAmount || targetAmount <= 0) {
      return next(
        new Error("Target amount is required and must be greater than zero.")
      );
    }

    // ✅ Create and save the post
    const newPost = new Post({
      author: authorId,
      title: title.trim(),
      description: description.trim(),
      proofLink: proofLink?.trim(),
      targetAmount, // Now required for both NGOs & receivers
    });

    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    // ✅ Fetch all active posts
    const posts = await Post.find({ isActive: true }).populate(
      "author",
      "name email role"
    );

    res.json({ posts });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    // ✅ Fetch the post
    const post = await Post.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("author", "name email role");

    if (!post) {
      return next(new Error("Post not found."));
    }

    res.json({ post });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { title, description, proofLink, targetAmount } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new Error("Post not found."));
    }

    // ✅ Only the post author or admin can update
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new Error("Access denied. You can only edit your own post."));
    }

    // ✅ Update post fields
    if (title) post.title = title.trim();
    if (description) post.description = description.trim();
    if (proofLink) post.proofLink = proofLink.trim();
    if (targetAmount) {
      if (targetAmount <= 0) {
        return next(new Error("Target amount must be greater than zero."));
      }
      post.targetAmount = targetAmount;
    }

    await post.save();

    res.json({ message: "Post updated successfully!", post });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new Error("Post not found."));
    }

    // ✅ Only the post author or admin can delete
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new Error("Access denied. You can only delete your own post.")
      );
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully!" });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
