const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongooseconnection = require("./config/mongoose.js");
const cors = require("cors");

const app = express();

const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: `http://localhost:3000`,
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

app.use("/auth", require("./routes/authRoutes.js"));
app.use("/profile", require("./routes/profileRoutes.js"));
app.use("/dashboard", require("./routes/dashboardRoutes.js"));
app.use("/donations", require("./routes/donationRoutes.js"));
app.use("/requests", require("./routes/requestRoutes.js"));
app.use("/campaigns", require("./routes/campaignRoutes.js"));
app.use("/settings", require("./routes/settingsRoutes.js"));
app.use("/notifications", require("./routes/notificationRoutes"));
app.use("/ngo", require("./routes/ngoRoutes"));

app.get("/", (req, res) => {
  res.send("NGO Donation API is Running");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
