const { EmbedBuilder } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { CombinedError, CombinedPropertyError } = require("@sapphire/shapeshift");
const path = require("path");

const removeUnwantedTraces = (input) => {
    const array = input.replaceAll(path.resolve("./"), ".").split("\n");
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
                        .setColor("#ff0000")
                        .setTimestamp(),
                ],
            });
        }
    });
};

module.exports = (client, err) => {
    if (err instanceof CombinedError || err instanceof CombinedPropertyError) {
        for (var i = 0; i < err.errors.length; i++) {
            handleError(client, err.errors[i]);
        }
    } else {
        handleError(client, err);
    }
};
