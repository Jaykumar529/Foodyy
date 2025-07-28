const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.MONGO_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("mongoDB is connected");
  })
  .catch((err) => {
    console.log("error while mongodb connection : ", err);
  });
