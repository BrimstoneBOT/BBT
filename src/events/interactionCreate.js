const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (!interaction.isCommand()) return;

    const command = fs.readdirSync(path.join(__dirname, '..', 'commands'))
      .flatMap(folder => {
        const folderPath = path.join(__dirname, '..', 'commands', folder);
        if (!fs.statSync(folderPath).isDirectory()) return [];

        const folderCommands = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
        return folderCommands.map(command => ({
          folder,
          name: command.slice(0, -3)
        }));
      })
      .find(cmd => cmd.name === interaction.commandName && cmd.folder);

    if (!command) {
      await interaction.reply({ content: 'Unknown command', ephemeral: true });
      return;
    }

    try {
      const commandPath = path.join(__dirname, '..', 'commands', command.folder, `${command.name}.js`);
      const commandFile = require(commandPath);

      // Add the client to the command file
      commandFile.client = client;

      await commandFile.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while executing this command', ephemeral: true });
    }
  },
};
