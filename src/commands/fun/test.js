module.exports = {
    name: 'test',
    description: 'A test command',
    async execute(interaction) {
      await interaction.reply('This is a test!');
    },
  };
  