const mongoose = require("mongoose");

module.exports = mongoose.model(
  "setupDB",
  new mongoose.Schema({
    GuildID: String,
    CommunityRoleID: String,
    StaffRoleID: String,
    AdminRoleID: String,
    BotRoleID: String,
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
