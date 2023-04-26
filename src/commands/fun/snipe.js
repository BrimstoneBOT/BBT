const { MessageEmbed } = require('discord.js');
const Snipe = require('../../models/snipe'); // Import the Snipe model

module.exports = {
  name: 'snipe',
  description: 'Snipe the last deleted message in the current channel.',
  async execute(interaction) {
    const snipes = await Snipe.find({ channelId: interaction.channelId }).sort({ _id: -1 }).limit(10);

    if (!snipes || snipes.length === 0) {
      return await interaction.reply('There is nothing to snipe!');
    }

    const snipe = snipes[0];
    if (snipe.deletedByProfanityFilter) {
      return await interaction.reply({ content: 'Nice try.' });
    } else {
      const embed = new MessageEmbed()
        .setAuthor({ name: snipe.author.tag, iconURL: snipe.author.avatarURL() })
        .setDescription(snipe.content)
        .setFooter({ text: `Sniped by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() })
        .setTimestamp();

      if (snipe.image) {
        embed.setImage(snipe.image);
      }

      return await interaction.reply({ embeds: [embed] });
    }
  },
};
