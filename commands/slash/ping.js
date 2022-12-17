const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Returns various latencies.",
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Pong!")
                    .addFields([
                        {
                            name: "Bot Latency",
                            value: `${Date.now() - interaction.createdTimestamp}ms`,
                            inline: true,
                        },
                        {
                            name: "API Latency",
                            value: `${client.ws.ping}ms`,
                            inline: true,
                        },
                    ])
                    .setColor("Random")
                    .setTimestamp(),
            ],
            ephemeral: false,
        });
    },
};
