const { Schema, model } = require('mongoose');

const GuildSettingsSchema = new Schema({
  guildId: { type: String, required: true },
  prefix: { type: String, default: '/' },
  profanityFilter: { type: Boolean, default: true },
});

module.exports = model('GuildSettings', GuildSettingsSchema);
