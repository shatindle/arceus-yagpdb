const { Permissions } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

const credentials = {
    user: process.env.YAGPDB_PQUSERNAME,
    host: process.env.YAGPDB_PQHOST,
    database: process.env.POSTGRES_DB,
    password: process.env.YAGPDB_PQPASSWORD,
    port: 5432,
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('note')
		.setDescription('Create a note on a user.  Requires MANAGE_MESSAGES permission')
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user the note is about")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("text")
                .setDescription("The note to record")
                .setRequired(true)),
	async execute(interaction) {
        try {
            const user = interaction.options.getUser("user");
            const text = interaction.options.getString("text");
            const hasPermission = interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);

            if (hasPermission) {
                const username = user.username + "#" + user.discriminator;
                const now = new Date().toISOString();

                try {
                    // create the warning
                    const client = new Client(credentials);
                    await client.connect();
                    await client.query(`INSERT INTO public.moderation_warnings(created_at, updated_at, guild_id, user_id, author_id, author_username_discrim, message, logs_link) VALUES (` +
                        `$1,` +  //   created_at = case.created_at
                        `$2,` + //   updated_at = case.created_at
                        `$3,` + //   guild_id = 725341600670023700
                        `$4,` + //   user_id = case.user_id
                        `$5,` + //   author_id = case.mod_id
                        `$6,` + //   author_username_discrim = case.mod_name
                        `$7,` + //   message = case.notes[0].body
                        `$8);`, //   logs_link = ''
                        [
                            now,
                            now,
                            parseInt(interaction.guild.id),
                            user.id,
                            interaction.member.user.id,
                            username,
                            "**NOTE:** " + text,
                            ""//interaction.url
                        ]);
                    await client.end();

                    await interaction.reply({ content: `Note added for <@${user.id}>` });
                } catch (err) {
                    await interaction.reply({ content: "Error creating note: " + err.toString() + " stack: " + err.stackß });
                }

                return;

            } else {
                await interaction.reply({ content: "You need the MANAGE_MESSAGES permission to run this command", ephemeral: true });
                return;
            }
        } catch (err) {
            console.log(`Error in /log: ${err}`);
        }
	},
};