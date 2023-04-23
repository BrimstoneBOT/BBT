require('dotenv').config({ path: './.env' });
const fs = require('fs');
const path = require('path');
const commandsPath = path.join(__dirname, 'commands');
const { Client, Intents, Permissions, Collection } = require('discord.js');
const { MongoClient } = require('mongodb');
const handleInteractionCreate = require('./events/interactionCreate');
const uri = process.env.MONGO_URI;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
  partials: ['MESSAGE', 'CHANNEL'],
});

client.commands = new Collection();
client.guildSettings = new Collection();
client.snipes = new Collection();

// Load commands
const commandFolders = fs.readdirSync(commandsPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(path.join(commandsPath, folder)).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, folder, file));
    client.commands.set(command.name, command);
  }
}

// Load events
const eventFiles = fs.readdirSync('./src/events').filter(file => file.startsWith('on'));
for (const file of eventFiles) {
  console.log(`Loading event file: ${file}`);
  const event = require(`./events/${file}`);

  if (typeof event !== 'function') {
    console.error(`Event file ${file} does not export a function. Please check its content.`);
    continue;
  }

  client.on(file.split('.')[0], (...args) => event(...args, client));
}

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
});

client.on('interactionCreate', async (interaction) => {
  console.log('interactionCreate event triggered');
  await handleInteractionCreate(client, interaction);
});

client.on('error', (error) => {
  console.error(error);
});

(async () => {
  try {
    const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoClient.connect();
    const db = mongoClient.db();

    // Create a collection for the guilds if it doesn't already exist
    if (!(await db.listCollections().toArray()).some(({ name }) => name === 'guilds')) {
      await db.createCollection('guilds');
      console.log('Created guilds collection');
    }

    // Add default guild settings for every guild in the bot
    const guilds = await client.guilds.fetch();
    for (const guild of guilds.values()) {
      const guildSettings = await db.collection('guilds').findOne({ guildId: guild.id });
      if (!guildSettings) {
        await db.collection('guilds').insertOne({
          guildId: guild.id,
          prefix: '/',
          profanityFilter: true,
        });
        console.log(`Default guild settings added for guild: ${guild.id}`);
      }
    }

    await client.login(process.env.TOKEN);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

client.login(process.env.TOKEN);
