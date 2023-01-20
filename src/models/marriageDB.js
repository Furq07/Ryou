const mongoose = require("mongoose");
module.exports = mongoose.model(
  "marriageDB",
  new mongoose.Schema({
    userId: String,
    proposer: String,
    isProposed: Boolean,
    isEngaged: Boolean,
    isMarriaged: Boolean,
  })
);
