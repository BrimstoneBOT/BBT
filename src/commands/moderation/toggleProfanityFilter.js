const { Message } = require('discord.js');
const GuildSettings = require('../../models/guildSettings');

module.exports = {
  data: {
    name: 'toggleprofanityfilter',
    description: 'Toggle the profanity filter on or off',
  },
  async execute(interaction = new Message()) {
    const { channel } = interaction;

    if (!channel) {
      return await interaction.reply({
        content: 'This command can only be used in a server channel.',
        ephemeral: true,
      });
    }

    const { guild } = channel;
    const { user } = interaction;

    if (!guild) {
      return await interaction.reply({
        content: 'This command can only be used in a server channel.',
        ephemeral: true,
      });
    }

    if (!guild.me.permissions.has('MANAGE_MESSAGES')) {
      return await interaction.reply({
        content: "I don't have permission to manage messages.",
        ephemeral: true,
      });
    }

    if (!user.permissions.has('MANAGE_MESSAGES')) {
      return await interaction.reply({
        content:
          'You need the "Manage Messages" permission to use this command.',
        ephemeral: true,
      });
    }

    const guildSettings = await GuildSettings.findOne({ guildId: guild.id });

    if (!guildSettings) {
      return await interaction.reply({
        content: 'Guild settings not found. Please try again later.',
        ephemeral: true,
      });
    }

    guildSettings.profanityFilterEnabled = !guildSettings.profanityFilterEnabled;

    try {
      await guildSettings.save();

      return await interaction.reply({
        content: `The profanity filter has been ${
          guildSettings.profanityFilterEnabled ? 'enabled' : 'disabled'
        }.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);

      return await interaction.reply({
        content: 'An error occurred while updating the profanity filter.',
        ephemeral: true,
      });
    }
  },
};
