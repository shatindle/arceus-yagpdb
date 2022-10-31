const { Permissions } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { setBackupChannel } = require("../logic/yagredis");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('backup')
		.setDescription('Channel to save warning backups for this server.  Backups occur at least every 3 days.')
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("The channel for storing backups, leave blank to disable backups")
                .setRequired(false)
                .addChannelTypes(/*ChannelTypes.GUILD_TEXT*/ 0)),
	async execute(interaction) {
        try {
            const channel = interaction.options.getChannel("channel");
            const hasPermission = interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);

            if (hasPermission) {
                await setBackupChannel(interaction.guild.id, channel ? channel.id : null);
                await interaction.reply({ content: `Backups will now be stored in <#${channel.id}>` });
                return;
            } else {
                await interaction.reply({ content: "You need the ADMINISTRATOR permission to run this command", ephemeral: true });
                return;
            }
        } catch (err) {
            console.log(`Error in /log: ${err}`);
        }
	},
};