const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const mongoose = require('mongoose');
require('dotenv').config();
const GuildSettings = require('./models/guildSettings');

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;
const mongoURI = process.env.MONGO_URI;

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

(async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    const rest = new REST({ version: '9' }).setToken(token);

    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );
    console.log('Successfully reloaded application (/) commands.');

    // Check if GuildSettings document already exists in the database for the guild
    const existingSettings = await GuildSettings.findOne({ guildId });
    if (!existingSettings) {
      console.log('No existing settings found, creating new settings document.');
      await GuildSettings.create({ guildId });
    } else {
      console.log('Existing settings found, skipping creation of new settings document.');
    }
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
})();
