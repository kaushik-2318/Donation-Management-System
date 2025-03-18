const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const mongooseconnection = require("./config/mongoose"); // Ensure this correctly connects to MongoDB
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/error");

const app = express();

// ✅ CORS Configuration (Allow only specific origins for security)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Allow frontend requests
    credentials: true, // Allow cookies
  })
);

// ✅ Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cookieParser()); // Enable cookie handling

// ✅ Connect to MongoDB (Make sure `mongooseconnection` handles errors properly)
mongooseconnection();

// ✅ Route Mounting
app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/posts", require("./routes/postRoutes"));
// app.use("/api/donations", require("./routes/donationRoutes"));
// app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
// app.use("/api/notifications", require("./routes/notificationRoutes"));

// ✅ Basic Home Route
app.get("/", (req, res) => {
  res.send("NGO Donation API is Running 🚀");
});

// ✅ Global Error Handling Middleware
app.use(errorHandler);

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
