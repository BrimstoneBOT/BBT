async function handleInteractionCreate(interaction) {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (error.code === 'INTERACTION_NOT_REPLIED') {
      await interaction.reply({
        content: 'An error occurred while executing this command',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'An error occurred while executing this command',
        ephemeral: true,
      });
    }
  }
}
