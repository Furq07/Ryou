const mongoose = require("mongoose");

module.exports = mongoose.model(
  "setupDB",
  new mongoose.Schema({
    GuildID: String,
    CommunityRoleID: String,
    StaffRoleID: String,
    AdminRoleID: String,
    LogChannelID: String,
    TicketParentID: String,
    TicketOpenedID: String,
    TicketLockedID: String,
    TicketMessageID: String,
    TicketChannelID: String,
    TicketTranscript: Boolean,
    TicketTranscriptID: String,
  })
);
