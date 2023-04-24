const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'List all available commands',
  async execute(interaction) {
    const commandsList = [
      {
        name: '/about',
        value: 'Get information about Brimstone!',
      },
      {
        name: '/help',
        value: 'List all available commands.',
      },
      {
        name: '/clean',
        value: 'Remove a specified number of messages from a channel. (Admin only)',
      },
      {
        name: '/ping',
        value: 'Check the bot\'s latency.',
      },
      {
        name: '/eightball',
        value: 'Ask a question and get a random answer!',
      },
      {
        name: '/kiss',
        value: 'Kiss another user! <3',
      },
      {
        name: '/snipe',
        value: 'Retrieve the last deleted message in the channel.',
      },
      {
        name: '/audit',
        value: 'Set up the audit system by creating an audit channel and assigning a role to the bot and user.',
      },
      {
        name: '/togglefilter',
        value: 'Toggle the profanity filter on/off for the server. (Admin only)',
      },      
    ];

    const helpEmbed = new MessageEmbed()
      .setColor('#ff69b4')
      .setTitle('BrimBot Help')
      .addFields(commandsList);

    await interaction.reply({ embeds: [helpEmbed] });
  },
};
