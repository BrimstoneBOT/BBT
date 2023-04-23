const { Collection } = require('discord.js');

// Keep track of processed interactions to prevent duplicates
const processedInteractions = new Set();

module.exports = async (client, interaction) => {
  console.log('interactionCreate event triggered');

  // Ignore interactions that have already been processed
  if (processedInteractions.has(interaction.id)) return;
  processedInteractions.add(interaction.id);

  if (!interaction.isCommand) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'An error occurred while executing this command', ephemeral: true });
  }
};
