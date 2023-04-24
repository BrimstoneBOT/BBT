const mongoose = require('mongoose');

const guildSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '!' },
  welcomeMessageEnabled: { type: Boolean, default: false },
  welcomeMessageChannel: { type: String, default: null },
  profanityFilterEnabled: { type: Boolean, default: true }, // set default to true
});

const GuildSettings = mongoose.model('GuildSettings', guildSettingsSchema);

module.exports = GuildSettings;
