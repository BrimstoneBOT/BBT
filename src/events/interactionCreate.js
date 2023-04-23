async function handleInteractionCreate(interaction, client) {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'An error occurred while executing this command', ephemeral: true });
  }
}

module.exports = handleInteractionCreate;
