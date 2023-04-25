const GuildSettings = require('../models/guildSettings');

module.exports = async (client, guild) => {
  try {
    // Check if the server configuration already exists in the database
    const existingConfig = await GuildSettings.findOne({ guildId: guild.id });
    if (!existingConfig) {
      // If the configuration doesn't exist, create a new one
      const guildSettings = new GuildSettings({ guildId: guild.id });
      await guildSettings.save();
      console.log(`Created new guild settings for server ${guild.name}`);
    } else {
      console.log(`Server ${guild.name} already has a config, skipping creation.`);
    }

    // Register slash commands with new server
    const commands = await guild.commands.set(client.commands);
    console.log(`Registered ${commands.size} slash commands for ${guild.name}.`);

  } catch (error) {
    console.error(error);
  }
};
