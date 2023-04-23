const { MongoClient } = require('mongodb');
const Guild = require('./src/models/guild');
const { Client, Intents } = require('discord.js');
require('dotenv').config({ path: './.env' });

const uri = process.env.MONGO_URI;
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  ],
});

async function addDefaultGuildSettings() {
    console.log('Adding default guild settings...');
  
    try {
      const guilds = await client.guilds.fetch();
  
      console.log(`Found ${guilds.size} guilds`);
  
      for (const [guildId, guild] of guilds) {
        console.log(`Processing guild: ${guildId}`);
  
        const guildSettings = await Guild.findOne({ guildId: guildId });
        if (guildSettings) {
          console.log(`Guild already has settings: ${guildId}`);
          continue;
        }
  
        const newGuildSettings = new Guild({
          guildId: guildId,
          prefix: '/',
          profanityFilter: true,
        });
  
        await newGuildSettings.save();
        console.log(`Default guild settings added for guild: ${guildId}`);
      }
  
      console.log('Finished adding default guild settings');
    } catch (error) {
      console.error('Error adding default guild settings:', error);
    }
  }
  

module.exports = client;
