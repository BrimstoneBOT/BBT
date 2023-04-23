const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'eightball',
  description: 'Ask the Magic 8-Ball a question',
  options: [
    {
      name: 'question',
      type: 3,
      description: 'Your question for the Magic 8-Ball',
      required: true,
    },
  ],
  async execute(interaction) {
    const answers = [
      'It is certain.',
      'It is decidedly so.',
      'Without a doubt.',
      'Yes - definitely.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook good.',
      'Yes.',
      'Signs point to yes.',
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now.',
      'Cannot predict now.',
      'Concentrate and ask again.',
      'Don\'t count on it.',
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.',
    ];

    const question = interaction.options.getString('question');
    const answer = answers[Math.floor(Math.random() * answers.length)];

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('🎱 The Magic 8-ball says...')
      .addFields(
        { name: 'Question:', value: question },
        { name: 'Answer:', value: answer }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
