const redis = require('redis');

const redisClient = redis.createClient({
    host: process.env.YAGPDB_REDIS.split(':')[0],
    port: parseInt(process.env.YAGPDB_REDIS.split(':')[1])
});

redisClient.on('error', (err) => {
    console.log('Error occured while connecting or accessing redis server');
    console.log(err);
});

async function load() {
    console.log("connecting to redis");
    await redisClient.connect();
}

async function getServerPrefix(guildId) {
    const prefix = await redisClient.get(`command_prefix:${guildId}`);

    return prefix ?? "-";
}

async function setBackupChannel(guildId, channelId) {
    if (channelId) await redisClient.set(`backup_channel:${guildId}`, channelId);
    else await redisClient.del(`backup_channel:${guildId}`);
}

async function getBackupChannel(guildId) {
    const channel = await redisClient.get(`backup_channel:${guildId}`);

    return channel;
}

module.exports = {
    load,
    getServerPrefix,
    setBackupChannel,
    getBackupChannel
};