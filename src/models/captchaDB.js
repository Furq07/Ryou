const mongoose = require("mongoose");
module.exports = mongoose.model(
  "captchaDB",
  new mongoose.Schema({
    guildID: String,
    users: Array,
  })
);
