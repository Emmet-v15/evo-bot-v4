const { cyan, red, magenta, gray, yellow, white, green } = require("colorette");
const { Timestamp } = require("@sapphire/time-utilities");
const { EmbedBuilder } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { CombinedError, CombinedPropertyError } = require("@sapphire/shapeshift");

const removeUnwantedTraces = (input) => {
    if (!input) return "";
    const array = input.replaceAll("/nodejsapps/botv1", "").split("\n");
    var stack = "";
    for (var i = 0; i < array.length; i++) {
        const line = array[i];
        if (!line.includes("node_modules")) {
            stack += `${line.trim()}\n`;
        }
    }
    return stack;
};

const handleError = (client, err) => {
    const stack = codeBlock(
        "sql",
        err.stack ? removeUnwantedTraces(err.stack).replace(`Error: ${err.message}\n`, "") : ""
    );
    const msg = removeUnwantedTraces(err.message);

    client.guilds.cache.forEach((guild) => {
        const channel = client.channels.cache.find((c) => c.id === client.settings.get(guild.id, "logs.channel"));
        if (channel) {
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Unhandled Error")
                        .addFields([
                            {
                                name: "Type:",
                                value: err.constructor.name,
                                inline: true,
                            },
                            {
                                name: "Message:",
                                value: msg,
                                inline: true,
                            },
                            {
                                name: "Stack:",
                                value: stack,
                            },
                        ])
                        .setColor("Random")
                        .setTimestamp(),
                ],
            });
        }
    });
};

exports.log = (content, type = "log") => {
    const timestamp = `[${cyan(new Timestamp("YYYY-MM-DD HH:mm:ss"))}]:`;

    switch (type) {
        case "log":
            return console.log(`${timestamp} ${gray(type.toUpperCase())} ${content} `);
        case "warn":
            return console.log(`${timestamp} ${yellow(type.toUpperCase())} ${content} `);
        case "error":
            if (content instanceof Error)
                return console.log(`${timestamp} ${red(type.toUpperCase())} ${content.stack} `);
            return console.log(`${timestamp} ${red(type.toUpperCase())} ${content} `);
        case "debug":
            return console.log(`${timestamp} ${magenta(type.toUpperCase())} ${content} `);
        case "cmd":
            return console.log(`${timestamp} ${white(type.toUpperCase())} ${content}`);
        case "ready":
            return console.log(`${timestamp} ${green(type.toUpperCase())} ${content}`);
        default:
            throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
    }
};

exports.error = (...args) => this.log(...args, "error");

exports.stack = (client, err) => {
    // this.log(err, "error");
    if (err instanceof CombinedError || err instanceof CombinedPropertyError) {
        for (var i = 0; i < err.errors.length; i++) {
            handleError(client, err.errors[i]);
        }
    } else {
        handleError(client, err);
    }
};

exports.warn = (...args) => this.log(...args, "warn");

exports.debug = (...args) => this.log(...args, "debug");

exports.cmd = (...args) => this.log(...args, "cmd");
