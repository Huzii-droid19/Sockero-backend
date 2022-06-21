const express = require("express");
const router = express.Router();
const models = require("../models");
const AWS = require("aws-sdk");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const storage = multer.memoryStorage({
  destination: function (req, res, callback) {
    callback(null, "");
  },
});
const upload = multer({ storage: storage }).single("img");
const s3 = new AWS.S3({
  accessKeyId: process.env.AMAZON_ACCESS_KEY,
  secretAccessKey: process.env.AMAZON_ACCESS_SECRET,
});

router.post("/addLeftover", upload, async (req, res) => {
  const { name, description, quantity, price, duration, img, category, m_id } =
    req.body;
  try {
    const item = await models.Leftover.findAll({
      where: {
        name: name,
      },
    });
    if (item.length > 0) {
      return res
        .status(401)
        .json({ data: item, message: "Leftover already listed!" });
    }
    if (req.file) {
      s3.upload(
        {
          Bucket: process.env.AMAZON_BUCKET_NAME,
          Key: `Leftovers/${uuidv4()}.${path.extname(req.file.originalname)}`,
          Body: req.file.buffer,
          ACL: "public-read",
        },
        async (err, data) => {
          if (err) {
            return res.status(500).json({
              message: "Error Occured while uploading image",
              error: err.message,
            });
          } else {
            const addItem = await models.Leftover.create({
              name: name,
              description: description,
              quantity: quantity,
              price: price,
              duration: duration,
              image: data.Location,
              category: category,
              manufacturer_id: m_id,
            });
            return res
              .status(200)
              .json({ data: addItem, message: "Leftover listed successfully" });
          }
        }
      );
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ source: "Error in listing", message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const leftovers = await models.Leftover.findAll({
      where: {
        manufacturer_id: req.params.id,
      },
    });
    return res.status(200).json({
      data: leftovers,
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({ source: "Error in listing", message: err.message });
  }
});
module.exports = router;
