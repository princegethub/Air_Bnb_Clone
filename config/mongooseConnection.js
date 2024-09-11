const mongoose = require("mongoose");
const debug = require("debug")("development:mongoose");
mongoose
  .connect("mongodb://localhost:27017/airbnb")
  .then(() => {
    debug("Connected Succesfully");
  })
  .catch((err) => {
    debug(err);
  });
