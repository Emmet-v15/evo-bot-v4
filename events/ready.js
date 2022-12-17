const { existsSync, readdirSync } = require("fs");

const slash = require("../systems/setup/slash");
const logger = require("../systems/logging/logger");

module.exports = async (client) => {
    logger.log(`Logged in as [${client.user.id}] 👌`);

    client.guilds.cache.forEach((guild) => {
        client.settings.ensure(guild.id, require("../systems/settings/template.json"));
    });

    for (const system of readdirSync("./systems/tasks/", { withFileTypes: true })) {
        if (system.isDirectory() && existsSync(`./systems/tasks/${system.name}`)) {
            for (const file of readdirSync(`./systems/tasks/${system.name}/`)) {
                if (file.endsWith(".js")) {
                    require(`../systems/tasks/${system.name}/${file}`)(client);
                }
            }
        } else if (system.isFile()) {
            require(`../systems/tasks/${system.name}`)(client);
        }
    }

    await slash(client);
    logger.log(
        `${client.user.tag}, serving ${client.users.cache.size} users in ${client.guilds.cache.size} servers`,
        "ready"
    );
};
