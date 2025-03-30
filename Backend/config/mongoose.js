const mongoose = require("mongoose");

const mongoUrl =
  process.env.MONGO_ATLAS_URL;

const options = {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // tls: true,
  // tlsAllowInvalidCertificates: process.env.NODE_ENV !== "production",
};

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl, options);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Attempting to reconnect...");
  connectDB();
});

module.exports = connectDB;
