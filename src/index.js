require('dotenv').config({ path: './.env' });
const fs = require('fs');
const path = require('path');
const commandsPath = path.join(__dirname, 'commands');
const { Client, Intents, Permissions } = require('discord.js');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;

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

client.on('ready', () => {
  console.log(`✔️  ${client.user.tag} is online!`);

  const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    console.log(`Loading event file: ${file}`);
    const event = require(`./events/${file}`);
    
    if (typeof event !== 'function') {
      console.error(`Event file ${file} does not export a function. Please check its content.`);
      continue;
    }

    client.on(file.split('.')[0], (...args) => event(client, ...args));
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

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
