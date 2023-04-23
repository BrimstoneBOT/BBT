const Guild = require('../models/guild');
const Filter = require('bad-words');
const badWordsFilter = new Filter({ list: ['bitch', 'bastard', 'nobr'] });

module.exports = async (client, message) => {
  if (message.author.bot) return;

  // Fetch the guild settings from the database
  const guildSettings = await Guild.findOne({ guildId: message.guild.id });
  console.log("Guild settings:", guildSettings); // Add this line
  if (!guildSettings) return;

  // Check if the profanity filter is enabled
  if (guildSettings.profanityFilter) {
    const hasBadWords = badWordsFilter.isProfane(message.content);
    console.log("Message content:", message.content);
    console.log("Has bad words:", hasBadWords);

    if (hasBadWords) {
      // Check if the message exists and the bot has permission to delete it
      if (message.deletable && message.channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) {
        message.delete()
          .catch(console.error);
      }
      message.reply('Watch your language! Profanity is not allowed.')
        .then(msg => {
          setTimeout(() => {
            msg.delete()
              .catch(console.error);
          }, 5000);
        })
        .catch(console.error);
    }
  }
};
