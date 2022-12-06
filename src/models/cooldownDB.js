const mongoose = require("mongoose");

module.exports = mongoose.model(
  "cooldownDB",
  new mongoose.Schema({
    MemberID: String,
    Cmd: String,
    Time: Number,
    Cooldown: Number,
  })
);
