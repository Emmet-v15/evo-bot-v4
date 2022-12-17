require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { readdirSync } = require("fs");
const enmap = require("enmap");

const logger = require("./systems/logging/logger");
const exception = require("./systems/logging/exception");
const interactionCreate = require("./events/interactionCreate");
const { InteractionWebhook } = require("discord.js");

logger.log("Starting...", "log");

const client = new Client({
    intents: [32767, GatewayIntentBits.MessageContent],
    partials: ["CHANNEL"],
});

client.settings = new enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: "deep",
    dataDir: "./systems/settings/data",
});

// Process

if (process.platform === "win32") {
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.on("SIGINT", function () {
        process.emit("SIGINT");
    });
}

process.on("SIGINT", function () {
    logger.log("Shutting Down...", "log");
    process.exit();
});

process.on("uncaughtException", exception.bind(null, client));

process.on("unhandledRejection", exception.bind(null, client));

// Events and Tasks

for (const event of readdirSync("./events/")) {
    if (event.endsWith(".js")) {
        client.on(event.substring(0, event.length - 3), require(`./events/${event}`).bind(null, client));
        logger.log(`Loading Event: ${event}. 👌`);
    }
}

for (const task of readdirSync("./systems/tasks", { withFileTypes: true })) {
    if (task.isDirectory()) {
        for (const file of readdirSync(`./systems/tasks/${task.name}/`)) {
            if (file.endsWith(".js")) {
                const path = `./systems/tasks/${task.name}/${file}`;
                const module = require(path);
                module(client);
                logger.log(`Loading Task: ${task.name}/${file}. 👌`);
            }
        }
    } else if (task.name.endsWith(".js")) {
        const path = `./systems/tasks/${task.name}`;
        const module = require(path);
        module(client);
        logger.log(`Loading Task: ${task.name}. 👌`);
    }
}
// Login

client.login();
