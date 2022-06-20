const { SlashCommandBuilder } = require('@discordjs/builders');
const auditInteraction = require("../logic/auditInteraction");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unbans a user. Reason requirement is same as ban command setting.')
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("Reason")
                .setRequired(false)),
	async execute(interaction) {
        await auditInteraction(interaction, "USER UNBANNED");
	},
};