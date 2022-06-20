const { SlashCommandBuilder } = require('@discordjs/builders');
const auditInteraction = require("../logic/auditInteraction");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans a member, specify number of days to delete with -ddays (0 to 7)')
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("duration")
                .setDescription("Duration")
                .setRequired(false))
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("Reason")
                .setRequired(false))
        .addStringOption(option => 
            option.setName("ddays")
                .setDescription("Number of days of messages to delete")
                .setRequired(false)),
	async execute(interaction) {
        await auditInteraction(interaction, "USER BANNED");
	},
};