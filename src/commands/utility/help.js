module.exports = {
  name: 'help',
  description: 'Shows help message',
  async execute(interaction) {
    const helpEmbed = new MessageEmbed()
      .setTitle('Help')
      .setDescription('This is a help message.')
      .setColor('#00ff00');
    await interaction.reply({ embeds: [helpEmbed] });
  },
};
