const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'about',
  description: 'Get information about the bot',
  options: [],
  async execute(interaction) {
    const supportServerUrl = 'https://discord.gg/csdtJMchZ9';
    const patreonUrl = 'https://www.patreon.com/BrimIndustries';

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('BRIMSTONE')
      .setURL('https://discord.gg/csdtJMchZ9')
      .setAuthor({
        name: 'brim',
        iconURL: interaction.user.avatarURL(),
      })
      .setDescription(
        'Brimstone is a versatile and feature-rich bot designed to enhance your Discord server experience. With a wide range of commands and features, Brimstone offers endless possibilities for customization and entertainment. Our team is dedicated to providing the best user experience and regularly updates the bot with new features, improvements, and bug fixes!'
      )
      .addFields(
        { name: 'Brimstone Server', value: `[Get 24/7 Support on our Server and more!](${supportServerUrl})`, type: 2 },
        { name: 'Support us! ❤️', value: `[Subscribe to our Patreon!](${patreonUrl})`, type: 2 }
      )
      .setTimestamp()
      .setFooter({ text: 'Made by brim', iconURL: interaction.user.avatarURL() });

    await interaction.reply({ embeds: [embed] });
  },
};
