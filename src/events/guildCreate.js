const commands = require('../commands');
const Guild = require('../models/guild');

module.exports = async (client, guild) => {
  try {
    const newGuild = new Guild({
      guildId: guild.id,
      prefix: '/',
      profanityFilter: true,
    });

    await newGuild.save();
    console.log(`New guild added: ${guild.name} (id: ${guild.id}).`);
  } catch (error) {
    console.error(`Error adding guild: ${error}`);
  }
};
