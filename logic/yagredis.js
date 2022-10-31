const redis = require('redis');

const redisClient = redis.createClient({
    url: `redis://${process.env.YAGPDB_REDIS}`
});

redisClient.on('error', (err) => {
    console.log('Error occured while connecting or accessing redis server');
    console.log(err);
});

async function load() {
    console.log("connecting to redis");
    try {
        await redisClient.connect();
    } catch {}
}

async function getServerPrefix(guildId) {
    const prefix = await redisClient.get(`command_prefix:${guildId}`);

    return prefix ?? "-";
}

async function setBackupChannel(guildId, channelId) {
    console.log(`backup_channel:${guildId}`);
    console.log(channelId);
    console.log(typeof channelId);

    if (channelId) await redisClient.set(`backup_channel:${guildId}`, channelId);
    else await redisClient.del(`backup_channel:${guildId}`);
}

async function getBackupChannel(guildId) {
    console.log(`backup_channel:${guildId}`);
    const channel = await redisClient.get(`backup_channel:${guildId}`);

    console.log(channel);

    return channel;
}

module.exports = {
    load,
    getServerPrefix,
    setBackupChannel,
    getBackupChannel
};