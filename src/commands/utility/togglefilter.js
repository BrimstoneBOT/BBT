const { CommandInteraction } = require('discord.js');
const GuildSettings = require('../../models/guildSettings');

module.exports = {
  name: 'togglefilter',
  description: 'Toggle the profanity filter on/off',
  async execute(interaction) {
    try {
      if (!interaction.isCommand()) return;
  
      const guildId = interaction.guildId;
      const guildSettings = await GuildSettings.findOne({ guildId }) || new GuildSettings({ guildId });
  
      guildSettings.profanityFilterEnabled = !guildSettings.profanityFilterEnabled;
      await guildSettings.save();
  
      if (!(interaction.deferred || interaction.replied)) {
        await interaction.reply({
          content: `Profanity filter ${guildSettings.profanityFilterEnabled ? 'enabled' : 'disabled'}`
        });
      }
    } catch (error) {
      console.error(error);
      if (!(interaction.deferred || interaction.replied)) {
        await interaction.reply({
          content: 'An error occurred while toggling the profanity filter'
        });
      }
    }
  }  
};
