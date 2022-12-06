const mongoose = require("mongoose");

module.exports = mongoose.model(
  "levelDB",
  new mongoose.Schema({
    MemberID: String,
    XP: Number,
    Level: Number,
  })
);
