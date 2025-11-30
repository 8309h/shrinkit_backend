const express = require("express");
const authenticate = require("../middlewares/authentication");
const {
  createShortUrl,
  redirectToLongUrl,
  generateQRCode,
  getAllUrls,
  deleteUrl,
  getUrlsByUser,
  getMyUrls
} = require("../controllers/urlController");

const urlRouter = express.Router();

// 🔥 URL ROUTER LOGGING
urlRouter.use((req, res, next) => {
  console.log("📍 URL ROUTER HIT:", req.method, req.originalUrl);
  next();
});

// 🔐 Protected Routes
urlRouter.post("/create", authenticate, createShortUrl);
urlRouter.post("/qrcode", authenticate, generateQRCode);

// Get ALL URLs (Protected)
urlRouter.get("/all", getAllUrls);
urlRouter.get("/my", authenticate, getMyUrls); 

// Delete URL (Protected)
urlRouter.delete("/delete/:shortUrl", authenticate, deleteUrl);

// 🌍 Public Redirect Route
urlRouter.get("/:shortUrl", redirectToLongUrl);

urlRouter.get("/user/:id", getUrlsByUser);


module.exports = urlRouter;
