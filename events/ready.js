const { existsSync, readdirSync } = require("fs");

const slash = require("../setup/slash");

const status = require("../systems/rbx/status");
const updates = require("../systems/rbx/updates");
const { instantInterval } = require("../functions/interval");
const logger = require("../functions/logger");

module.exports = async(client) => {
    console.log(`Logged in as ${client.user.tag}, ${client.user.id}`);
    for (const system of readdirSync("./systems/", { withFileTypes: true })) {
        if (system.isDirectory() && existsSync(`./systems/${system.name}/init.js`)) {
            require(`../systems/${system.name}/init.js`)(client);
        }
    }
    instantInterval(status, 1000 * 60 * 15, client);
    instantInterval(updates, 1000 * 60, client);

    console.log("Started All Systems");
    await slash(client);
    console.log("Registered Slash Commands");
};