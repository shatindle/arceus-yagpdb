//require("dotenv").config();
const { Pool, Client } = require("pg");
const { Client:Discord, Intents, Permissions } = require('discord.js');

const client = new Discord({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ], 
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'] 
});


const credentials = {
  user: process.env.YAGPDB_PQUSERNAME,
  host: process.env.YAGPDB_PQHOST,
  database: process.env.POSTGRES_DB,
  password: process.env.YAGPDB_PQPASSWORD,
  port: 5432,
};

async function extractWarnings() {
    const client = new Client(credentials);
    await client.connect();
    const moderation_warnings = await client.query("SELECT * FROM moderation_warnings");
    await client.end();
  
    return moderation_warnings.rows;
}

async function backup() {
    const backupChannel = await client.channels.fetch(process.env.BACKUP_SVC_CHANNEL);
    try {
        console.log(`${new Date().toISOString()}: Running backup routine`);
        const warnings = await extractWarnings();

        console.log(`${new Date().toISOString()}: Sending backup to server`);
        const data = Buffer.from(JSON.stringify(warnings));

        await backupChannel.send({
            files: [{
                attachment: data,
                name: "warnings.json"
            }]
        });
        console.log(`${new Date().toISOString()}: Backup sent successfully`);
    } catch (err) {
        console.log(`${new Date().toISOString()}: Error creating backup`);
        await backupChannel.send(`Unable to send backup file: ${err.toString()}`);
    }
}

client.on('messageCreate', async message => {
    // ignore direct messages
    if (!message.guild) return;

    // ignore posts from bots
    if (message.author.bot) return;

    // ignore posts from non-mods
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;

    if (message.content.trim().indexOf("-note ") === 0) {
        const parts = message.content.split(/\s+/);

        if (parts.length > 2) {
            let userId;

            if (parts[1].match(/^\d+$/)) {
                userId = parts[1];
            } else if (parts[1].match(/^\<\#\d+\>$/)) {
                userId = parts[1].replace("<#", "").replace(">","");
            } else {
                await message.channel.send("Please provide a valid user ID.  Example: `-note 972980501453365288 This is a note`");
                return;
            }

            const user = await client.users.fetch(userId);

            if (user && user.id) {
                const username = message.member.user.username + "#" + message.member.user.discriminator;

                // clean the string
                let text = message.content.substring(message.content.indexOf(" ")).trim();
                text = text.substring(text.indexOf(" ")).trim();

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
                            parseInt(message.guild.id),
                            userId,
                            message.member.id,
                            username,
                            "NOTE: " + text,
                            message.url
                        ]);
                    await client.end();

                    await message.channel.send("Note added");
                } catch (err) {
                    await message.channel.send("Error creating warning: " + err.toString() + " stack: " + err.stackß);
                }

                return;
            }

            await message.channel.send("User not found");
            return;
        }
    }

    return;
});

client.once("ready", async () => {
    setInterval(backup, process.env.BACKUP_FREQUENCY ? parseInt(process.env.BACKUP_FREQUENCY) : 1000 * 60 * 60 * 24);

    // run it once right now
    await backup();
});

client.login(process.env.YAGPDB_BOTTOKEN.substring("Bot ".length));