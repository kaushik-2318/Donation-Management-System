const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const mongooseconnection = require("./config/mongoose");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongooseconnection();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes.js"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/campaigns", require("./routes/campaignRoutes"));

// TODO: Uncomment when routes are implemented
// app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
// app.use("/api/notifications", require("./routes/notificationRoutes"));

app.get("/", (req, res) => {
  res.send("NGO Donation API is Running");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
