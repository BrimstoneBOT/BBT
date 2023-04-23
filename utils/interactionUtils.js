const { Permissions } = require('discord.js');

module.exports = {
  getMemberFromInteraction: (interaction) => {
    const member = interaction.guild.members.cache.get(interaction.user.id);
    return member;
  },

  checkPermissions: (interaction, permissions) => {
    const member = interaction.guild.members.cache.get(interaction.user.id);

    if (!member) {
      return false;
    }

    return member.permissions.has(permissions);
  },

  checkBotPermissions: (interaction, permissions) => {
    const botMember = interaction.guild.members.cache.get(interaction.client.user.id);

    if (!botMember) {
      return false;
    }

    return botMember.permissions.has(permissions);
  },

  sendErrorMessage: async (interaction, message) => {
    await interaction.reply({ content: message, ephemeral: true });
  },
};
