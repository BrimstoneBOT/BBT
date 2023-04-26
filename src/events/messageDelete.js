const { MessageEmbed } = require('discord.js');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;

module.exports = async (client, message) => {
  if (!message || !message.author || message.author.bot) return;

  const mongoClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await mongoClient.connect();
  const database = mongoClient.db('discordbot');
  const settings = database.collection('settings');
  const auditChannels = database.collection('auditChannels');

  const { guild } = message;
  const { channelId } = message;
  const { id: guildId } = guild;

  const guildSettings = await settings.findOne({ guildId });
  const auditChannelEntry = await auditChannels.findOne({ guildId });

  // Store the deleted message in the client.snipes Map
  const snipes = client.snipes.get(channelId) || [];
  snipes.unshift({
    content: message.content,
    author: message.author,
    image: message.attachments.first()?.url || null,
  });
  client.snipes.set(channelId, snipes.slice(0, 10)); // Limit to the 10 most recent snipes

  try {
    const auditChannel = guild.channels.cache.get(auditChannelEntry.auditChannelId);
    const author = message.author;

    // Fetch audit logs to find the user who deleted the message
    const fetchedLogs = await guild.fetchAuditLogs({
      limit: 10,
      type: 'MESSAGE_DELETE',
    });

    const deletionLog = fetchedLogs.entries.find((entry) => {
      const timeDifference = (Date.now() - entry.createdTimestamp) / 1000; // Time difference in seconds
      const isMessageDeletion = entry.extra?.channel?.id === channelId && entry.target.id === message.author.id && entry.extra?.messageId === message.id;
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
      .addFields({ name: 'Channel', value: `<#${channelId}>` });

    if (executor) {
      embed.addFields({ name: 'Deleted by', value: `${executor.tag} (${executor.id})` });
    }

    if (message.content) {
      embed.setDescription(message.content);
    }

    if (message.attachments.first()) {
      const attachment = message.attachments.first();
      const isVideo = attachment.contentType.startsWith('video/');

      if (!isVideo) {
        embed.setImage(attachment.url);
      }

      if (isVideo) {
        const videoMessage = `${author.tag} (${author.id}) posted a video that got deleted in <#${channelId}>:\n${attachment.url}`;
        await auditChannel.send({ content: videoMessage });
        return;
      }
    }
    
    await auditChannel.send({ embeds: [embed] });
    } catch (error) {
    console.error('Error processing message delete event:', error);
    } finally {
    await mongoClient.close();
    }
    };