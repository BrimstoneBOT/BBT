// commands/togglefilter/index.js
const { MessageEmbed } = require('discord.js');
const GuildSettings = require('../../models/guildSettings');

module.exports = {
  name: 'togglefilter',
  description: 'Toggles the profanity filter on or off.',
  async execute(interaction) {
    const guildId = interaction.guild.id;

    try {
      const guildSettings = await GuildSettings.findOne({ guildId });

      if (!guildSettings) {
        const newGuildSettings = new GuildSettings({
          guildId,
          profanityFilter: true,
        });

        await newGuildSettings.save();
        return interaction.reply('Profanity filter is now enabled.');
      }

      guildSettings.profanityFilter = !guildSettings.profanityFilter;
      await guildSettings.save();

      const filterStatus = guildSettings.profanityFilter ? 'enabled' : 'disabled';
      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Profanity Filter')
        .setDescription(`Profanity filter has been ${filterStatus}.`)
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error toggling profanity filter:', error);
      interaction.reply('An error occurred while trying to toggle the profanity filter.');
    }
  },
};
