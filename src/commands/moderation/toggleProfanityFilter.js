module.exports = {
  name: 'toggleprofanityfilter',
  description: 'Toggle the profanity filter on or off.',
  async execute(interaction) {
    const guildSettings = await interaction.client.guildSettings.get(interaction.guild.id) || {};

    console.log('Before:', guildSettings);

    if (guildSettings.profanityFilterEnabled) {
      guildSettings.profanityFilterEnabled = false;
      await interaction.reply('The profanity filter has been turned off.');
    } else {
      guildSettings.profanityFilterEnabled = true;
      await interaction.reply('The profanity filter has been turned on.');
    }

    await guildSettings.save();
    interaction.client.guildSettings.set(interaction.guild.id, guildSettings);

    console.log('After:', guildSettings);
  },
};
