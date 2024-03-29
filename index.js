require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { readdirSync } = require("fs");
const enmap = require("enmap");

const logger = require("./systems/logging/logger");

const exception = require("./systems/logging/exception");

logger.log("Starting...", "log");

const client = new Client({
    intents: [32767, GatewayIntentBits.MessageContent],
    partials: ["CHANNEL"],
});
logger.setClient(client);

client.settings = new enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: "deep",
    dataDir: "./systems/settings/data",
});
client.settings.ensure("global", {});
client.settings.set("global", process.env.DEV ? process.env.DEBUG_CHANNEL_DEV : process.env.DEBUG_CHANNEL_PROD, "debug.channel");

client.userDB = new enmap({
    name: "userDB",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: "deep",
    dataDir: "./systems/userDB/data",
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

if (!process.env.DEV) {
    process.on("uncaughtException", exception.bind(null, client));
    process.on("unhandledRejection", exception.bind(null, client));
}
// Events and Tasks

for (const event of readdirSync("./events/")) {
    if (event.endsWith(".js")) {
        const task = logger.load(`Loading Event: ${event}.`);
        client.on(event.substring(0, event.length - 3), require(`./events/${event}`).bind(null, client));
        task.complete();
    }
}

// for (const task of readdirSync("./systems/tasks", { withFileTypes: true })) {
//     if (task.isDirectory()) {
//         for (const file of readdirSync(`./systems/tasks/${task.name}/`, { withFileTypes: true })) {
//             if (task.name.endsWith(".js")) {
//                 console.log(task);
//                 const task_ = logger.log(`Loading Task: ${task.name}/${file}.`);
//                 const path = `./systems/tasks/${task.name}/${file}`;
//                 const module = require(path);
//                 module(client);
//                 task_.complete();
//             }
//         }
//     } else if (task.name.endsWith(".js")) {
//         const task_ = logger.load(`Loading Task: ${task.name}.`);
//         const path = `./systems/tasks/${task.name}`;
//         const module = require(path);
//         module(client);
//         task_.complete();
//     }
// }

if (process.env.DEV) logger.warn("Running in Development Mode.");
client.login(process.env.DEV ? process.env.DISCORD_TOKEN_DEV : process.env.DISCORD_TOKEN_PROD);
