const express = require("express");
var fs = require("fs");
var { parse } = require("csv-parse");
const getStream = require("get-stream");
const router = express.Router();
const models = require("../models");
const authorize = require("../middleware/userAuthorize");
const jwtGenerator = require("../utils/jwtGenerator");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const user = await models.Buyer.findAll({
      where: {
        email: email,
      },
    });
    if (user.length > 0) {
      return res.status(401).json({ message: "Buyer already exist!" });
    }

    const salt = await bcrypt.genSalt(9);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let addUser = await models.Buyer.create({
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: bcryptPassword,
    });

    const userJWTToken = jwtGenerator(addUser.id);

    return res.status(200).json({
      status: true,
      token: userJWTToken,
      user: addUser,
      message: "Buyer registered successfully!",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ source: "Error in registering the Buyer", message: err.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  await models.Buyer.findOne({
    where: {
      email: email,
    },
  })
    .then((buyer) => {
      if (buyer) {
        const isMatch = bcrypt.compareSync(password, buyer.password);
        if (isMatch) {
          const token = jwtGenerator(buyer.id);
          return res.status(200).json({
            status: true,
            token: token,
            user: buyer,
            message: "Login Successful",
          });
        } else {
          return res.status(400).json({
            message: "Incorrect password",
          });
        }
      } else {
        return res.status(400).json({
          message: "Buyer not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ source: "Error in finding the user", message: err.message });
    });
});
module.exports = router;
