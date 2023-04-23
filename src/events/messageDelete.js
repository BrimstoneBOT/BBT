const { MessageEmbed } = require('discord.js');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;

const profanityWords = require('../data/profanityWords.json');

module.exports = async (client, message) => {
  if (!message || !message.author || message.author.bot) return;

  // Check if the message contains profanity
  const hasProfanity = profanityWords.some(word => message.content.toLowerCase().includes(word));

  // Store the deleted message in the client.snipes Map
  const snipes = client.snipes.get(message.channelId) || [];
  snipes.unshift({
    content: message.content,
    author: message.author,
    image: message.attachments.first()?.url || null,
    deletedByProfanityFilter: hasProfanity,
  });
  client.snipes.set(message.channelId, snipes.slice(0, 10)); // Limit to the 10 most recent snipes

  const mongoClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await mongoClient.connect();
    const database = mongoClient.db('discordbot');
    const auditChannels = database.collection('auditChannels');

    const auditChannelEntry = await auditChannels.findOne({ guildId: message.guild.id });

    if (!auditChannelEntry) return;

    const auditChannel = message.guild.channels.cache.get(auditChannelEntry.auditChannelId);
    const author = message.author;

    // Fetch audit logs to find the user who deleted the message
    const fetchedLogs = await message.guild.fetchAuditLogs({
      limit: 10,
      type: 'MESSAGE_DELETE',
    });

    const deletionLog = fetchedLogs.entries.find((entry) => {
      const timeDifference = (Date.now() - entry.createdTimestamp) / 1000; // Time difference in seconds
      const isMessageDeletion = entry.extra?.channel?.id === message.channel.id && entry.target.id === message.author.id && entry.extra?.messageId === message.id;
      return isMessageDeletion && timeDifference < 5;
    });

    let executor;
    if (deletionLog) {
      const { target, executor: logExecutor } = deletionLog;
      if (target.id === message.author.id) {
        executor = logExecutor;
      }
    }

    const embed = new MessageEmbed()
      .setColor('#FF0000')
      .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
      .setFooter({ text: `User ID: ${author.id}` })
      .setTimestamp()
      .addFields({ name: 'Channel', value: `<#${message.channel.id}>` });

    if (executor) {
      embed.addFields({ name: 'Deleted by', value: `${executor.tag} (${executor.id})` });
    }

    if (message.content) {
      if (hasProfanity) {
        embed.setDescription(`[Profanity] ${message.content}`);
      } else {
        embed.setDescription(message.content);
      }
    }

    if (message.attachments.first()) {
      const attachment = message.attachments.first();
      const isVideo = attachment.contentType.startsWith('video/');

      if (!isVideo) {
        embed.setImage(attachment.url);
      }

      if (isVideo) {
        const videoMessage = `${author.tag} (${author.id}) posted a video that got deleted in <#${message.channel.id}>:\n${attachment.url}`;
        await auditChannel.send({ content: videoMessage });
        return;
      }
    }

    await auditChannel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Error sending message to audit channel:', error);
  } finally {
    await mongoClient.close();
  }

  // Send a message to the user whose message was deleted if it contained profanity
  if (hasProfanity) {
    try {
      const warningMessage = `Your message in <#${message.channel.id}> contained inappropriate language and has been deleted.`;
      const user = await client.users.fetch(message.author.id);
      user.send(warningMessage);
    } catch (error) {
      console.error('Error sending warning message to user:', error);
      if (error.code === 50007) {
        console.error('Cannot send messages to this user. Ignoring.');
      }
    }
  }
};
