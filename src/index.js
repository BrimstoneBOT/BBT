require('dotenv').config({ path: './.env' });
const fs = require('fs');
const path = require('path');
const commandsPath = path.join(__dirname, 'commands');
const { Client, Intents } = require('discord.js');
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

client.on('ready', async () => {
  console.log(`✔️  ${client.user.tag} is online!`);
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

  const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    client.on(file.split('.')[0], (...args) => event(client, ...args));
  }
});

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB!');
});

client.login(process.env.TOKEN);
