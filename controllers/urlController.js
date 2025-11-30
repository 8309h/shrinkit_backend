const URL = require('../models/urlModel');
const QRCode = require('qrcode');

/* ---------------------------------------------------
   CREATE SHORT URL
--------------------------------------------------- */
async function createShortUrl(req, res) {
  console.log("🔥 Hit → POST /url/create");
  console.log("📥 Body:", req.body);

  const { longUrl } = req.body;
  const userId = req.user.userId;

  try {
    let url = await URL.findOne({ longUrl, userId });
    console.log("🔍 Existing URL Check:", url);

    if (url) {
      return res.json(url);
    }

    let shortCode;
    let isShortCodeUnique = false;

    while (!isShortCodeUnique) {
      shortCode = generateShortUrl();
      console.log("🎲 Generated Short Code:", shortCode);

      const existingUrl = await URL.findOne({ shortUrl: shortCode });
      if (!existingUrl) isShortCodeUnique = true;
    }

    url = new URL({
      longUrl,
      shortUrl: shortCode,
      userId
    });

    await url.save();
    console.log("✅ Saved:", url);

    res.json({
      longUrl: url.longUrl,
      shortUrl: url.shortUrl,
      userId: url.userId,
      visited: url.visited
    });

  } catch (err) {
    console.error("❌ Error in createShortUrl:", err.message);
    res.status(500).send("Server Error");
  }
}
/* ---------------------------------------------------
   GENERATE SHORT URL CODE
--------------------------------------------------- */
function generateShortUrl(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortUrl = '';

  for (let i = 0; i < length; i++) {
    shortUrl += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  console.log("✨ Final Short URL:", shortUrl);
  return shortUrl;
}

/* ---------------------------------------------------
   REDIRECT TO ORIGINAL URL
--------------------------------------------------- */
// async function redirectToLongUrl(req, res) {
//   const shortCode = req.params.shortUrl;

//   try {
//     const url = await URL.findOne({ shortUrl: shortCode });

//     if (!url) {
//       return res.status(404).send('URL not found');
//     }
//     url.visited = (url.visited || 0) + 1;
//     await url.save();

//     return res.redirect(url.longUrl);
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// }

async function redirectToLongUrl(req, res) {
  const shortCode = req.params.shortUrl;

  try {
    const url = await URL.findOneAndUpdate(
      { shortUrl: shortCode },
      { $inc: { visited: 1 } },
      { new: true }
    );

    if (url) return res.redirect(url.longUrl);

    res.status(404).send("URL not found");
  } catch (err) {
    res.status(500).send("Server Error");
  }
}



/* ---------------------------------------------------
   GET ALL URLS
--------------------------------------------------- */
async function getAllUrls(req, res) {
  console.log("🔥 Hit → GET /url/all");

  try {
    const urls = await URL.find();
    res.json(urls);
  } catch (err) {
    console.error("❌ Error in getAllUrls:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
}

/* ---------------------------------------------------
   DELETE URL
--------------------------------------------------- */
async function deleteUrl(req, res) {
  const { shortUrl } = req.params;
  console.log("🔥 Hit → DELETE /url/delete/" + shortUrl);

  try {
    const deleted = await URL.findOneAndDelete({ shortUrl });

    if (!deleted) {
      return res.status(404).json({ msg: "URL Not Found" });
    }

    console.log("🗑️ Deleted:", shortUrl);
    res.json({ msg: "URL Deleted" });

  } catch (err) {
    console.error("❌ Error deleting URL:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
}

/* ---------------------------------------------------
   GENERATE QR CODE
--------------------------------------------------- */
async function generateQRCode(req, res) {
  console.log("🔥 Hit → POST /url/qrcode");
  console.log("📥 Body:", req.body);

  const { longUrl } = req.body;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(longUrl);
    const qrCodeImageBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');

    const url = new URL({ longUrl, qrCode: qrCodeImageBuffer });
    await url.save();

    res.setHeader('Content-Type', 'image/png');
    res.send(qrCodeImageBuffer);

  } catch (error) {
    console.error("❌ Error generating QR code:", error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
}

async function getUrlsByUser(req, res) {
  try {
    const userId = req.params.id;
    const urls = await URL.find({ userId });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
}
async function getMyUrls(req, res) {
  try {
    const userId = req.user.userId;
    const urls = await URL.find({ userId }).sort({ createdAt: -1 }); // latest first
    res.json(urls);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
}



module.exports = {
  createShortUrl,
  redirectToLongUrl,
  generateQRCode,
  getAllUrls,
  deleteUrl,
  getUrlsByUser,
  getMyUrls

};
