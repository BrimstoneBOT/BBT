const { Schema, model } = require('mongoose');

const GuildSchema = new Schema({
	guildId: { type: String, required: true },
	prefix: { type: String, default: '/' },
	profanityFilter: { type: Boolean, default: true }, // Add this line
});

module.exports = model('Guild', GuildSchema);
