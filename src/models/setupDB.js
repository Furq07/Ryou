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
    TicketTranscriptID: String,
    JTCChannelID: String,
    JTCSettingID: String,
    JTCCategoryID: String,
    VerificationSetuped: Boolean,
    VerificationType: String,
    VerificationChannelID: String,
    verificationCategoryID: String,
    VerificationMessageID: String,
    JTCInfo: Array,
    LogSettings: Array,
  })
);
