const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config(); // Load the values from the .env file

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = [];

const readCommands = (dir) => {
  const files = fs.readdirSync(path.join(__dirname, dir));

  for (const file of files) {
    const stat = fs.lstatSync(path.join(__dirname, dir, file));

    if (stat.isDirectory()) {
      readCommands(path.join(dir, file));
    } else if (file.endsWith('.js')) {
      const command = require(path.join(__dirname, dir, file));
      console.log(`Loading command: ${command.name}`); // Add this line to log the command names
      commands.push({
        name: command.name,
        description: command.description,
        options: command.options,
        defaultPermission: command.defaultPermission,
        type: 1,
        execute: command,
      });
    }
  }
};


readCommands('commands');

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
