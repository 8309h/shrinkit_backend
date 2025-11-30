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

urlRouter.post("/create", authenticate, createShortUrl);
urlRouter.post("/qrcode", authenticate, generateQRCode);

urlRouter.get("/all", getAllUrls);
urlRouter.get("/my", authenticate, getMyUrls); 

urlRouter.delete("/delete/:shortUrl", authenticate, deleteUrl);

// urlRouter.get("/:shortUrl", redirectToLongUrl);

urlRouter.get("/user/:id", getUrlsByUser);


module.exports = urlRouter;
