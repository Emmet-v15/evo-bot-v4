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
                    const task = logger.load(`Loading task: ${system.name}/${file}.`);
                    require(`../systems/tasks/${system.name}/${file}`)(client);
                    task.complete();
                }
            }
        } else if (system.isFile()) {
            const task = logger.load(`Loading task: ${system.name}.`);
            require(`../systems/tasks/${system.name}`)(client);
            task.compelte();
        }
    }

    await slash(client);
    logger.log(`${client.user.tag}, serving ${client.users.cache.size} users in ${client.guilds.cache.size} servers`, "ready");
};
