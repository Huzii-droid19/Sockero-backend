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
    // productID,
    askPrice,
    details,
    duration,
    offerPrice,
    name,
  } = req.body;
  console.log();
  console.log("buyerID", req.body.buyerID);
  console.log();
  return;

  try {
    const order = await models.Order.findAll({
      where: {
        buyer_id: buyerID,
      },
    });
    if (order.length > 0) {
      return res.status(401).json({ message: "Same Order already exist!" });
    }

    let addItem = await models.Order.create({
      buyer_id: buyerID,
      manufacturer_id: manufacturerID,
      quantity: quantity,
      // product_id: productID,
      ask_price: askPrice,
      details: details,
      duration: duration,
      offer_price: offerPrice,
      name: name,
    });
    return res.status(200).json({ message: "Order Created successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ source: "Error in adding the Order", message: err.message });
    console.error(err);
  }
});
router.get("/", async (req, res) => {
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

router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    
    const is_update = await models.Order.update(
      {status: status},
      {
        where: {
          id: req.params.id,
        },
      }
    );
    
    return res.status(200).json({ message: "Status Updated Successfully" });
  } catch (err) {
    return res.status(500).json({
      source: "Error in updating the status",
      message: err.message,
    });
  }
});

module.exports = router;
