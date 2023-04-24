require('dotenv').config({ path: './.env' });
const fs = require('fs');
const path = require('path');
const commandsPath = path.join(__dirname, 'commands');
const { Client, Intents, Collection } = require('discord.js');
const mongoose = require('mongoose');
const GuildSettings = require('./models/guildSettings');
const uri = process.env.MONGO_URI;
const profanityWords = require('./data/profanityWords.json');
const ProfanityFilter = require('./helpers/profanityFilter');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
  partials: ['MESSAGE', 'CHANNEL'],
});

client.guildSettings = new Map();
client.snipes = new Map();
client.profanityFilter = new ProfanityFilter(profanityWords);
client.commands = new Collection();

// Loop through the command files and set them up
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.name, command);
}

client.on('ready', async () => {
  console.log(`✔️  ${client.user.tag} is online!`);
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

  const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    client.on(file.split('.')[0], (...args) => event(client, ...args));
  }
});

// Set up the interactionCreate event listener
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB!');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Handle duplicate key error
mongoose.connection.on('error', (err) => {
  if (err.code === 11000) {
    console.error('Duplicate key error:', err.keyValue);
    GuildSettings.findOneAndUpdate({ guildId: err.keyValue.guildId }, { $set: err.keyValue }, { upsert: true, new: true }, (error, doc) => {
      if (error) {
        console.error('Error updating document:', error);
      } else {
        console.log('Document updated successfully:', doc);
      }
    });
  }
});

client.login(process.env.TOKEN);
