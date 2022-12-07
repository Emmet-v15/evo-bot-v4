// Variables //

const { Client, GatewayIntentBits } = require("discord.js");
const { readdirSync } = require("fs");
const enmap = require("enmap");

const logger = require("./functions/logger");
logger.log("Starting...", "log");

const client = new Client({
    intents: [32767, GatewayIntentBits.MessageContent],
    partials: ["CHANNEL"],
});

client.settings = new enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: "deep"
});

// Process //

process.on("uncaughtException", logger.error(null, client));

process.on("unhandledRejection", logger.error(null, client));

// Events //

for (const event of readdirSync("./events/")) {
    if (event.endsWith(".js")) {
        client.on(event.substring(0, event.length - 3), require(`./events/${event}`).bind(null, client));
    }
}

// Login //

client.login(require("./config.json").token);