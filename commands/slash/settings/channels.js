module.exports = {
    name: "channels",
    description: "Gets the current log channel, or sets it if one is specified.",
    permission: 2,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        const type = interaction.options.getString("type");
        const channel = interaction.options.getChannel("channel");
        if (channel) {
            const id = channel.id;
            client.settings.set(interaction.guild.id, id, `${type}.channel`);
            interaction.editReply({ content: `The ${type} channel has been set to <#${id}>` });
        } else {
            interaction.editReply({
                content: `The ${type} channel is currently <#${client.settings.get(
                    interaction.guild.id,
                    `${type}.channel`
                )}>`,
            });
        }
    },
    options: [
        {
            type: "String",
            name: "type",
            description: "The type of channel to set.",
            required: true,
            choices: { logs: "logs", modlogs: "modlogs", updates: "updates", predictions: "predictions" },
        },
        { type: "Channel", name: "channel", description: "The channel which should be used." },
    ],
};
