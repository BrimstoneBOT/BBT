module.exports = {
  name: 'clean',
  description: 'Remove a specified number of messages from a channel (Admin only)',
  options: [
    {
      name: 'amount',
      type: 4, // INTEGER
      description: 'The number of messages to remove',
      required: true,
    },
  ],
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return await interaction.reply('You do not have the required permissions to use this command.');
    }

    const amount = parseInt(interaction.options.getInteger('amount'));
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return await interaction.reply('Please provide a valid number between 1 and 100.');
    }

    await interaction.channel.bulkDelete(amount, true);
    await interaction.reply(`Successfully deleted ${amount} messages.`);
  },
};
