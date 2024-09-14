const mongoose = require("mongoose");
const debug = require("debug")("development:mongoose");
mongoose
  .connect(process.env.ATLAS_CONNECTION)
  .then(() => {
    debug("Connected Succesfully");
  })
  .catch((err) => {
    debug(err);
  });
