const GuildSettings = require('../models/guildSettings');

module.exports = async (client, guild) => {
  try {
    // Create new guild settings document in the database
    const guildSettings = new GuildSettings({ guildId: guild.id });
    await guildSettings.save();

    // Register slash commands with new server
    const commands = await guild.commands.set(client.commands);
    console.log(`Registered ${commands.size} slash commands for ${guild.name}.`);

  } catch (error) {
    console.error(error);
  }
};
