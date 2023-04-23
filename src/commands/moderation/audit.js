const { Permissions } = require('discord.js');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;

module.exports = {
  name: 'audit',
  description: 'Set up the audit system by creating an audit channel and assigning a role to the bot and user.',
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return await interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const guildId = interaction.guild.id;

    const auditChannelName = 'audit-logs';
    const auditRoleName = 'Audit';

    // Check if the audit channel exists or create one
    let auditChannel = interaction.guild.channels.cache.find(
      (channel) => channel.type === 'GUILD_TEXT' && channel.name === auditChannelName
    );

    if (!auditChannel) {
      auditChannel = await interaction.guild.channels.create(auditChannelName, {
        type: 'GUILD_TEXT',
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: Permissions.FLAGS.VIEW_CHANNEL,
          },
        ],
      });
    }

    // Check if the audit role exists or create one
    let auditRole = interaction.guild.roles.cache.find((role) => role.name === auditRoleName);

    if (!auditRole) {
      auditRole = await interaction.guild.roles.create({
        name: auditRoleName,
        color: 'BLUE',
        permissions: [Permissions.FLAGS.VIEW_AUDIT_LOG, Permissions.FLAGS.VIEW_CHANNEL],
      });
    }

    // Assign the audit role to the bot and the user
    await interaction.guild.members.cache.get(interaction.client.user.id).roles.add(auditRole);
    await interaction.member.roles.add(auditRole);

    const mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      await mongoClient.connect();
      const database = mongoClient.db('discordbot');
      const auditChannels = database.collection('auditChannels');

      await auditChannels.updateOne(
        { guildId },
        { $set: { auditChannelId: auditChannel.id } },
        { upsert: true }
      );

      await interaction.followUp({
        content: `The audit channel has been set to ${auditChannel}`,
        ephemeral: false,
      });
    } catch (error) {
      console.error('Error in audit command:', error);
      await interaction.followUp({
        content: 'An error occurred while setting up the audit channel and role.',
        ephemeral: true,
      });
    } finally {
      await mongoClient.close();
    }
  },
};
