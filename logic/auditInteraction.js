const { Permissions } = require("discord.js");
const { Client } = require("pg");

const credentials = {
    user: process.env.YAGPDB_PQUSERNAME,
    host: process.env.YAGPDB_PQHOST,
    database: process.env.POSTGRES_DB,
    password: process.env.YAGPDB_PQPASSWORD,
    port: 5432,
};

async function auditInteraction(interaction, action) {
    try {
        const user = interaction.options.getUser("user");
        const text = interaction.options.getString("reason");
        const hasPermission = interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);

        if (hasPermission) {
            const username = interaction.member.user.username + "#" + interaction.member.user.discriminator;
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
                        BigInt(interaction.guild.id),
                        user.id,
                        interaction.member.user.id,
                        username,
                        `**${action.toUpperCase()}**: ${text}`,
                        ""//interaction.url
                    ]);
                await client.end();

            } catch (err) {
                // don't respond since we're just bolting onto the interaction
            }

            return;

        } else {
            // don't respond since we're just bolting onto the interaction
            return;
        }
    } catch (err) {
        console.log(`Error in /log: ${err}`);
    }
}

module.exports = auditInteraction;