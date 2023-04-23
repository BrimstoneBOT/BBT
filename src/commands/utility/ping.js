module.exports = {
  name: 'ping',
  description: "Replies with the bot's current latency.",
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    interaction.editReply(`Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
  },
};
