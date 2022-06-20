const { SlashCommandBuilder } = require('@discordjs/builders');
const auditInteraction = require("../logic/auditInteraction");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmutes a member')
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("Reason")
                .setRequired(false)),
	async execute(interaction) {
        await auditInteraction(interaction, "USER UNMUTED");
	},
};