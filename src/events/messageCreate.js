const GuildSettings = require('../models/guildSettings');
const profanityWords = require('../data/profanityWords.json');

module.exports = async (client, message) => {
  try {
    if (message.author.bot) return;

    const guildId = message.guild.id;
    const guildSettings = await GuildSettings.findOne({ guildId }) || new GuildSettings({ guildId });

    console.log(`Guild settings: ${JSON.stringify(guildSettings)}`);

    // Check if message contains profanity
    const hasProfanity = guildSettings.profanityFilterEnabled && profanityWords.some(word => message.content.toLowerCase().includes(word));
    console.log(`Has profanity: ${hasProfanity}`);

    // Check if message contains links
    const hasLinks = /(http[s]?:\/\/[^\s]+)/gi.test(message.content);
    console.log(`Has links: ${hasLinks}`);

    if (hasProfanity || hasLinks) {
      console.log(`Deleting message: ${message.content}`);
      await message.delete();
      const channel = message.guild.channels.cache.get(guildSettings.auditLogChannel);
      if (channel) {
        channel.send(`Message sent by ${message.author.username} in ${message.channel} contained inappropriate language/links and has been deleted: \`${message.content}\``)
          .catch(error => console.error(error));
      }
      // Send a public message in the channel to notify other users
      await message.channel.send({
        content: `${message.author}, your message contains inappropriate language/links and has been removed.`,
        fetchReply: true
      }).catch(error => console.error(error));
    }
  } catch (error) {
    console.error(error);
  }
};
