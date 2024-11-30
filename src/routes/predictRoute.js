const express = require("express");
const multer = require("multer");
const { predict, getHistory } = require("../controllers/predictController");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
});

router.post("/", upload.single("image"), predict);
router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      status: "fail",
      message: "Payload content length greater than maximum allowed: 1000000",
    });
  }
  next(err);
});

router.get("/histories", getHistory);

module.exports = router;
