const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // ✅ Set default status code if not already set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Show stack trace only in development
  });
};

module.exports = errorHandler;
