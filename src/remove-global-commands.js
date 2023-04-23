const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');

dotenv.config();

const clientId = process.env.CLIENT_ID;
const token = process.env.TOKEN;

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started removing global application (/) commands.');

    const globalCommands = await rest.get(Routes.applicationCommands(clientId));
    for (const command of globalCommands) {
      await rest.delete(Routes.applicationCommand(clientId, command.id));
      console.log(`Deleted global command: ${command.name}`);
    }

    console.log('Successfully removed global application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
