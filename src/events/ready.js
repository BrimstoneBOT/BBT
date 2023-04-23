const GuildSettings = require('../models/guildSettings');

module.exports = async (client) => {
  console.log(`✔️  ${client.user.tag} is online!`);
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

  // Load guild settings into memory on startup
  const guildSettingsList = await GuildSettings.find({});
  guildSettingsList.forEach((guildSettings) => {
    client.guildSettings.set(guildSettings.guildId, guildSettings);
  });
};
