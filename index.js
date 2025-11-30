const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connection } = require("./configs/db");
const urlRouter = require("./routes/urlRoutes");
const userRouter = require("./routes/userRoutes");
const {redirectToLongUrl}=require("./controllers/urlController")

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔥 GLOBAL LOGGER (You WILL see logs now)
app.use((req, res, next) => {
  console.log("===================================");
  console.log("🌐 NEW REQUEST");
  console.log("➡️ Method:", req.method);
  console.log("➡️ URL:", req.url);
  console.log("📥 Body:", req.body);
  console.log("===================================");
  next();
});

// Root route
app.get("/", (req, res) => {
  console.log("Welcome route hit");
  res.send("Welcome to URL-Shortner From Harshal");
});

// Routes
app.use("/url", urlRouter);
app.use("/user", userRouter);
urlRouter.get("/:shortUrl", redirectToLongUrl);

const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await connection;
    console.log("✅ MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB Connection Failed:");
    console.error(err.message);
    process.exit(1);
  }
})();
