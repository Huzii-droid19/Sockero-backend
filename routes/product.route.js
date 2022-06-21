const express = require("express");
const router = express.Router();
const models = require("../models");
const bcrypt = require("bcrypt");
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

router.post("/addProduct", upload, async (req, res) => {
  const { name, description, img, category, m_id } = req.body;
  try {
    if (req.file) {
      s3.upload(
        {
          Bucket: process.env.AMAZON_BUCKET_NAME,
          Key: `Products/${uuidv4()}.${path.extname(req.file.originalname)}`,
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
            const new_product = await models.Product.create({
              name: name,
              description: description,
              image: data.Location,
              category: category,
              manufacturer_id: m_id,
            });
            return res.status(200).json({
              message: "Product Created Successfully",
              product: new_product,
            });
          }
        }
      );
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ source: "Error in adding the Product", message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const user = await models.Product.findAll();
    if (user.length < 1) {
      return res.status(401).json({ data: "No data" });
    }

    return res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      source: "Getting products",
      message: err.message,
    });
  }
});
router.delete("/delete-product/:product_id", async (req, res) => {
  console.log(req.params.product_id);
  await models.Product.destroy({
    where: {
      id: req.params.product_id,
    },
  })
    .then(async (p) => {
      if (p) {
        const products = await models.Product.findAll();
        res
          .status(200)
          .json({ message: "Product deleted successfully", data: products });
      } else {
        res.status(401).json({ message: "Product not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        source: "Error in deleting the Product",
        message: err.message,
      });
    });
});
module.exports = router;
