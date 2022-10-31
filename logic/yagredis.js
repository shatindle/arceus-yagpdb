const redis = require('redis');

const redisClient = redis.createClient(6379,'127.0.0.1');

redisClient.on('error', (err) => {
    console.log('Error occured while connecting or accessing redis server');
});

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
    getServerPrefix,
    setBackupChannel,
    getBackupChannel
};