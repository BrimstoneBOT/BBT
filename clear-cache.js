require('dotenv').config({ path: './.env' });
const { Client, Intents } = require('discord.js');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.on('ready', async () => {
  console.log(`✔️  ${client.user.tag} is online!`);

  // Clear the command cache for each guild
  const guilds = client.guilds.cache;
  for (const guild of guilds.values()) {
    await guild.commands.set([]);
  }

  console.log('Command cache cleared.');
  process.exit();
});

client.login(process.env.TOKEN);
