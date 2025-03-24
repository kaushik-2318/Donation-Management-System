const mongoose = require("mongoose");

// ✅ Construct MongoDB URI
const mongoUrl =
  process.env.MONGO_ATLAS_URL;

// ✅ MongoDB Connection Options
const options = {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // tls: true, // Ensure TLS encryption for secure connections
  // tlsAllowInvalidCertificates: process.env.NODE_ENV !== "production", // Allow invalid certs only in development
};

// ✅ Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl, options);
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

// ✅ Handle connection errors after initial connection
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Error:", err);
});

// ✅ Reconnect on disconnection
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
  connectDB();
});

module.exports = connectDB;
