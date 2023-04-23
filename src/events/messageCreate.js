const GuildSettings = require('../models/guildSettings');
const profanityWords = require('../data/profanityWords.json');

module.exports = async (client, message) => {
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
    message.delete();
    message.reply('Your message contains inappropriate language/links and has been removed.');
  }
};
