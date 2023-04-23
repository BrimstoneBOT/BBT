const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

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

      if (command.data && command.data.name) {
        console.log(`Loading command: ${command.data.name}`);
        commands.push(command.data);
      } else if (command.name) {
        console.log(`Loading command: ${command.name}`);
        commands.push(command);
      }
    }
  }
};

readCommands('commands');

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started deleting application (/) commands.');
    //await rest.delete(Routes.applicationGuildCommands(clientId, guildId));
    console.log('Finished deleting application (/) commands.');

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
