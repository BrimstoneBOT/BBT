const GuildSettings = require('../models/guildSettings');

module.exports = async (client, guild) => {
  try {
    // Create new guild settings document in the database
    const guildSettings = new GuildSettings({ guildId: guild.id });
    await guildSettings.save();

    console.log(`Created new settings document for guild ${guild.id}.`);
  } catch (error) {
    console.error(error);
  }
};
