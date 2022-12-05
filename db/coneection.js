const mongoose = require("mongoose");
// for config.env
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "./config.env" });
const DB =process.env.URL
const conectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(DB, conectionParams).then(() => {
    console.log("detabase is connected");
  })
  .catch((error) => {
    console.log(error);
  });