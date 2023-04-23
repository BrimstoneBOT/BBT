const { Client, Intents, MessageEmbed } = require('discord.js');
const axios = require('axios');
const { GIPHY_API_KEY, MONGO_URI } = process.env;
const mongoose = require('mongoose');

const kissSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  count: { type: Number, default: 1 },
});

const Kiss = mongoose.model('Kiss', kissSchema);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✔️  Connected to MongoDB!');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

module.exports = {
  name: 'kiss',
  description: 'Kiss another user',
  options: [
    {
      name: 'user',
      type: 6, // USER
      description: 'The user you want to kiss',
      required: true,
    },
  ],
  async execute(interaction) {
    const sender = interaction.user;
    const receiver = interaction.options.getUser('user');
  
    if (sender.id === receiver.id) {
      return await interaction.reply("You can't kiss yourself, silly!");
    }
  
    if (receiver.id === interaction.client.user.id) {
      return await interaction.reply("I'm... flattered but let's not do that.");
    }
  
    const response = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=anime+kiss&limit=50&offset=${Math.floor(Math.random() * 50)}&rating=g&lang=en`);
    const gifUrl = response.data.data[0].images.original.url;
  
    const kiss = await Kiss.findOneAndUpdate(
      { senderId: sender.id, receiverId: receiver.id },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
  
    const kissEmbed = new MessageEmbed()
      .setColor('#ff69b4')
      .setDescription(`<@${sender.id}> kissed <@${receiver.id}> for the ${kiss.count} time ❤️`)
      .setImage(gifUrl);

    await interaction.reply({ embeds: [kissEmbed] });
  }
};
