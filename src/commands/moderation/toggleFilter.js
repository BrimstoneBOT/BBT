const mongoose = require('mongoose');
const GuildSettings = require('../../models/guildSettings');

module.exports = {
  name: 'togglefilter',
  description: 'Toggle the profanity filter on/off for the server',
  type: 1,
  async execute(interaFction) {
    const guildId = interaction.guildId;

    try {
      await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      const guildSettings = await GuildSettings.findOneAndUpdate({ guildId }, { $set: { profanityFilterEnabled: !guildSettings.profanityFilterEnabled } }, { new: true, upsert: true });
      if (!guildSettings) {
        return interaction.reply('This server has no settings in the database');
      }
      guildSettings.profanityFilterEnabled = !guildSettings.profanityFilterEnabled;
      await guildSettings.save();
      return interaction.reply(`Profanity filter has been ${guildSettings.profanityFilterEnabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      console.error(err);
      return interaction.reply('An error occurred while toggling the profanity filter');
    } finally {
      await mongoose.connection.close();
    }
  },
};
