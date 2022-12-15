const mongoose = require("mongoose");

module.exports = mongoose.model(
  "setupDB",
  new mongoose.Schema({
    GuildID: String,
    mainRoleID: String,
    staffRoleID: String,
    TicketParentID: String,
    TicketOpenedID: String,
    TicketLockedID: String,
    TicketTranscriptID: String,
    logChannelID: String,
    JTCChannelID: String,
    JTCSettingID: String,
    JTCCategoryID: String,
    JTCInfo: Array,
  })
);
