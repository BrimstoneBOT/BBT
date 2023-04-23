const fs = require('fs');
const path = require('path');
const commandsPath = path.join(__dirname, '..', 'commands');

module.exports = async (client, interaction) => {
  if (!interaction.isCommand()) return;

  console.log(`Command: ${interaction.commandName}, Params: ${JSON.stringify(interaction.options)}`);

  const command = fs.readdirSync(commandsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .flatMap(dirent => fs.readdirSync(path.join(commandsPath, dirent.name)).filter(file => file.endsWith('.js')).map(file => ({ folder: dirent.name, name: file })))
    .find((cmd) => cmd.name === `${interaction.commandName}.js` && cmd.folder);

  if (!command) {
    await interaction.reply({ content: 'Unknown command', ephemeral: true });
    return;
  }

  try {
    const commandPath = path.join(commandsPath, command.folder, command.name);
    const commandFile = require(commandPath);

    // Add the client to the command file
    commandFile.client = client;

    await commandFile.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'An error occurred while executing this command', ephemeral: true });
  }
};
