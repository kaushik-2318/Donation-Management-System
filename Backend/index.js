const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongooseconnection = require("./config/mongoose.js");
const cors = require("cors");

const app = express();

const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: `${process.env.CLIENT_URL}` || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongooseconnection();

app.use("/api/auth", require("./routes/authRoutes.js"));
app.use("/api/profile", require("./routes/profileRoutes.js"));
app.use("/api/dashboard", require("./routes/dashboardRoutes.js"));
app.use("/api/donations", require("./routes/donationRoutes.js"));
app.use("/api/requests", require("./routes/requestRoutes.js"));
app.use("/api/campaigns", require("./routes/campaignRoutes.js"));
app.use("/api/settings", require("./routes/settingsRoutes.js"));

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
