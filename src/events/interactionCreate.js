const { MessageEmbed } = require('discord.js');

module.exports = async (interaction, client) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const errorMessage = new MessageEmbed()
      .setColor('#FF0000')
      .setTitle('An error occurred while executing this command')
      .setDescription('Please contact the bot owner if the issue persists.');

    await interaction.reply({ embeds: [errorMessage], ephemeral: true });
  }
};
