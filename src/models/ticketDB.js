const mongoose = require("mongoose");

module.exports = mongoose.model(
  "ticketDB",
  new mongoose.Schema({
    GuildID: String,
    MemberID: String,
    ChannelID: String,
    ClaimedID: String,
    TicketID: String,
    LockStatus: Boolean,
  })
);
