const { MessageEmbed } = require("discord.js");
const Snipe = require("../../models/snipeModel");
const ProfanityFilter = require("../../helpers/profanityFilter");
const profanityFilter = new ProfanityFilter();

module.exports = {
  name: "snipe",
  description: "Snipes the last deleted message.",
  options: [],
  async execute(interaction) {
    const snipe = await Snipe.findOne({
      channelId: interaction.channel.id,
    }).sort({ deletedAt: -1 });

    if (!snipe) {
      return interaction.reply("There's nothing to snipe.");
    }

    if (profanityFilter.hasProfanity(snipe.content)) {
      return interaction.reply("Nice try.");
    }

    const embed = new MessageEmbed()
      .setTitle("Sniped Message")
      .setDescription(snipe.content)
      .addFields({ name: "Original Poster", value: `<@${snipe.author.id}>` });

    if (snipe.deletedAt) {
      embed.addFields({
        name: "Deleted At",
        value: snipe.deletedAt.toLocaleString(),
      });
    }

    embed
      .setFooter({
        text: `Sniped by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor("RED");

    interaction.reply({ embeds: [embed] });
  },
};
