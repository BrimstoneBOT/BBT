const GuildSettings = require('../models/guildSettings');

module.exports = async (client, message) => {
  if (!message || message.author?.bot) return;

  const content = message?.content;

  if (content?.includes('discord.gg/')) {
    await message.delete();
    return message.channel.send('Invites are not allowed in this server!');
  }

  if (!message.guild) return;
  const guildSettings = await GuildSettings.findOne({ guildId: message.guild.id });
  const prefix = guildSettings.prefix;

  if (!content.startsWith(prefix)) return;

  const args = content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = message.client.commands.get(commandName) ||
    message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  // Check if user has required permissions
  const memberPermissions = message.member.permissions;
  const requiredPermissions = new Discord.Permissions(command.permissions || 0);
  const missingPermissions = requiredPermissions.missing(memberPermissions);

  if (missingPermissions.length > 0) {
    return message.reply(`You are missing the following permissions: ${missingPermissions.join(', ')}`);
  }

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while executing this command');
  }
};
