const mongoose = require("mongoose");

module.exports = mongoose.model(
  "profileDB",
  new mongoose.Schema({
    MemberID: String,
    RealName: String,
    Age: Number,
    AboutMe: String,
    Pronounce: String,
    Gender: String,
  })
);
