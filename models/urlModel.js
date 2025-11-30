const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, unique: true },
  visited: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("URL", urlSchema);
