const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();
const PORT = process.env.PORT || 5000;
const corsOptions = { credentials: true, origin: process.env.url || "*" };
const app = express();

//express middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", express.static("public"));
app.use("/api/buyer/", require("./routes/buyer.route"));
app.use("/api/manufacturer", require("./routes/manufacturer.route"));
app.use("/api/product", require("./routes/product.route"));
app.use("/api/order", require("./routes/order.route"));
app.use("/api/admin/", require("./routes/admin.route"));
app.use("api/leftover", require("./routes/leftover.route"));

app.listen(PORT, () => console.log(`Listening to PORT ${PORT}`));
