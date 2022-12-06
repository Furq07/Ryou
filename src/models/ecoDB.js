const mongoose = require("mongoose");

module.exports = mongoose.model(
  "ecoDB",
  new mongoose.Schema({
    MemberID: String,
    Cash: Number,
    Bank: Number,
    Banklimit: Number,
    Ruby: Number,
    BeingRobbed: Boolean,
  })
);
