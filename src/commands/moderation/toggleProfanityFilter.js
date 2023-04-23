async execute(interaction) {
  try {
    const mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await mongoClient.connect();
    const database = mongoClient.db('discordbot');
    const settings = database.collection('settings');

    const result = await settings.findOneAndUpdate(
      { _id: 'profanityFilterEnabled' },
      { $set: { value: !profanityFilterEnabled } },
      { returnOriginal: false }
    );

    const newValue = result.value.value;
    console.log(`Updated profanity filter enabled setting to: ${newValue}`);
    await interaction.reply(`Profanity filter has been ${newValue ? 'enabled' : 'disabled'}.`);

    await mongoClient.close();
  } catch (error) {
    console.error(error);
    await interaction.reply('An error occurred while toggling the profanity filter.');
  }
}
