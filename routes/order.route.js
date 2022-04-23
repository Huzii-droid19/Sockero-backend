const express = require("express");
var fs = require("fs");
var { parse } = require("csv-parse");
const getStream = require("get-stream");
const router = express.Router();
const models = require("../models");
const authorize = require("../middleware/userAuthorize");
const jwtGenerator = require("../utils/jwtGenerator");
const bcrypt = require("bcrypt");

router.post("/order", async (req, res) => {
  const {
    buyerID,
    manufacturerID,
    quantity,
    productID,
    askPrice,
    details,
    duration,
    offerPrice,
  } = req.body;

  try {
    const order = await models.Order.findAll({
      where: {
        buyer_id: buyerID,
      },
    });
    if (order.length > 0) {
      return res.status(401).json({ message: "Product already exist!" });
    }

    let addItem = await models.Order.create({
      buyer_id: buyerID,
      manufacturer_id: manufacturerID,
      quantity: quantity,
      product_id: productID,
      ask_price: askPrice,
      details: details,
      duration: duration,
      offer_price: offerPrice,
    });
    return res.status(200).json({ message: "Product added successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ source: "Error in adding the Product", message: err.message });
  }
});
router.get("/", async(req, res) => {
	try {
	  const user = await models.Order.findAll();
	  if (user.length < 1) {
		return res.status(401).json({ data: "No data" });
	  }
  
	  return res.status(200).json({ data: user });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({
		source: "Getting Orders",
		message: err.message,
	  });
	}
  });
module.exports = router;
