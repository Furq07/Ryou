const mongoose = require("mongoose");
module.exports = mongoose.model(
  "draftDB",
  new mongoose.Schema({
    GuildID: String,
    VerificationMode: Boolean,
    VerificationDesc: String,
    VerificationChannelID: String,
  })
);
