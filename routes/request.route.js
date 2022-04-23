const express = require("express");
var fs = require("fs");
var { parse } = require("csv-parse");
const getStream = require("get-stream");
const router = express.Router();
const models = require("../models");
const authorize = require("../middleware/userAuthorize");
const jwtGenerator = require("../utils/jwtGenerator");
const bcrypt = require("bcrypt");

router.get("/by/buyer/:id", async (req, res) => {
  const buyerID = req.params.id;

  try {
    const user = await models.Request.findAll({
      where: {
        buyer_id: buyerID,
      },
    });
    if (user.length < 1) {
      return res.status(401).json({ data: "No data" });
    }

    return res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      source: "Getting requests by buyer id",
      message: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const user = await models.Request.findAll();
    if (user.length < 1) {
      return res.status(401).json({ data: "No data" });
    }

    return res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      source: "Getting requests",
      message: err.message,
    });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { buyer_id, name, description, quantity, asking_days, asking_price } =
      req.body;
    const user = await models.Request.create({
      buyer_id: buyer_id,
      name: name,
      description: description,
      quantity: quantity,
      asking_days: asking_days,
      asking_price: asking_price,
    });
    return res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      source: "Posting requests",
      message: err.message,
    });
  }
});

router.put("/respond/:id", async (req, res) => {
  try {
    const data = await models.Request.findAll({
      where: {
        id: req.params.id,
      },
    });
    console.log(data[0].id);
    const { manufacturer_id, offered_price, offered_duration } = req.body;
    const user = await models.Offer.create({
      request_id: data[0].id,
      buyer_id: data[0].buyer_id,
      name: data[0].name,
      description: data[0].description,
      quantity: data[0].quantity,
      asking_days: data[0].asking_days,
      asking_price: data[0].asking_price,
      manufacturer_id: manufacturer_id,
      offered_price: offered_price,
      offered_duration: offered_duration,
    });
    return res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      source: "Manufacturer requests",
      message: err.message,
    });
  }
});

router.post("/create/order", async (req, res) => {
  try {
    const {
      buyer_id,
      manufacturer_id,
      name,
      details,
      quantity,
      offered_price,
      offered_duration,
    } = req.body;

    await models.Offer.destroy({
      where: {
        buyer_id,
        manufacturer_id,
        name,
        quantity,
        offered_price,
        offered_duration,
      },
    });

    const user = await models.Order.create({
      buyer_id,
      manufacturer_id,
      name,
      details,
      quantity,
      offer_price: offered_price,
      duration: offered_duration,
    });
    return res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      source: "Manufacturer requests",
      message: err.message,
    });
  }
});

router.get("/offers/:id", async (req, res) => {
  try {
    const user = await models.Offer.findAll({
      where: {
        buyer_id: req.params.id,
      },
    });
    return res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      source: "Manufacturer requests",
      message: err.message,
    });
  }
});
module.exports = router;
