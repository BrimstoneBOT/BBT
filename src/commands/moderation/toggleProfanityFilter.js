const { SlashCommandBuilder } = require('@discordjs/builders');
const Guild = require('../../models/guild'); // Update the path

module.exports = {
	data: new SlashCommandBuilder()
		.setName('toggle-profanity-filter')
		.setDescription('Toggles the profanity filter on or off.'),
	async execute(interaction) {
		const guildId = interaction.guildId;

		// Fetch the guild settings from the database
		const guildSettings = await Guild.findOne({ guildId });
		if (!guildSettings) {
			await interaction.reply('Error fetching guild settings.');
			return;
		}

		// Update the profanity filter setting
		guildSettings.profanityFilter = !guildSettings.profanityFilter;
		await guildSettings.save();

		await interaction.reply(`Profanity filter is now ${guildSettings.profanityFilter ? 'enabled' : 'disabled'}.`);
	},
};
