const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;

module.exports = {
  data: {
    name: 'toggleprofanityfilter',
    description: 'Toggle the profanity filter on or off.',
  },
  async execute(interaction) {
    const mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      await mongoClient.connect();
      const database = mongoClient.db('discordbot');
      const settings = database.collection('settings');

      const guildSettings = await settings.findOne({ guildId: interaction.guild.id });

      const filterStatus = guildSettings?.profanityFilter ?? true; // Default to true if not set
      const newStatus = !filterStatus;

      if (guildSettings) {
        await settings.updateOne({ guildId: interaction.guild.id }, { $set: { profanityFilter: newStatus } });
      } else {
        await settings.insertOne({ guildId: interaction.guild.id, profanityFilter: newStatus });
      }

      await interaction.reply(`Profanity filter has been turned ${newStatus ? 'on' : 'off'}.`);
    } catch (error) {
      console.error('Error toggling profanity filter:', error);
      await interaction.reply({ content: 'An error occurred while toggling the profanity filter.', ephemeral: true });
    } finally {
      await mongoClient.close();
    }
  },
};
