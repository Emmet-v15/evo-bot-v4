const template = require("./template");

module.exports = (client) => {
    client.guilds.cache.forEach((guild) => {
        client.settings.ensure(guild.id, template);
    });
};
