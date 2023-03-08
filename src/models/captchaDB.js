const mongoose = require("mongoose");

module.exports = mongoose.model(
  "captchaDB",
  new mongoose.Schema({
    GuildID: String,
    MemberID: String,
    Code: String,
  })
);
