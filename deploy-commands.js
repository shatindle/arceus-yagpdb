require("dotenv").config();
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token, localDev, guildId } = require('./config.json');
const { Client:Discord, Intents, Permissions, Collection } = require('discord.js');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const disallowedFiles = [
	"ban.js",
	"mute.js",
	"unban.js",
	"unmute.js"
];

for (const file of commandFiles) {
	// exclude certain files
	if (disallowedFiles.indexOf(file) > -1) continue;

	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const client = new Discord({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ], 
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'] 
});

client.once("ready", async () => {
	const rest = new REST({ version: '9' }).setToken(token);

    const allGuilds = [];
    client.guilds.cache.forEach(guild => allGuilds.push(guild.id));

    for (var guild of allGuilds) {
		await rest.put(Routes.applicationGuildCommands(clientId, guild), { body: commands });
		console.log(`Successfully registered application commands to ${guild}`);
	}

	process.exit(0);
});

client.login(process.env.YAGPDB_BOTTOKEN.substring("Bot ".length));