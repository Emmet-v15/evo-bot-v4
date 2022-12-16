const template = require("../systems/settings/template");

module.exports = (client, guild) => {
    client.settings.ensure(guild.id, template);
};
