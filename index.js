//require("dotenv").config();
const { Pool, Client } = require("pg");
const { Client:Discord, Collection, Intents } = require('discord.js');

const client = new Discord({ 
    intents: [
        Intents.FLAGS.GUILDS
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

client.once("ready", async () => {
    setInterval(backup, 1000 * 60 * 60 * 24);

    // run it once right now
    await backup();
});

console.log(process.env);

client.login(process.env.YAGPDB_BOTTOKEN.substring("Bot ".length));