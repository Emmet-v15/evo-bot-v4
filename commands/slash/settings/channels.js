module.exports = {
    name: "channels",
    description: "Gets the current log channel, or sets it if one is specified.",
    permission: 2,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const type = interaction.options.getString("type");
        const channel = interaction.options.getChannel("channel");
        const action = interaction.options.getString("action");

        if (action === "remove") {
            client.settings.delete(interaction.guild.id, `${type}.channel`);
            interaction.editReply({ content: `The \`${type}\` channel has been removed.` });
        } else if (action === "set") {
            client.settings.set(interaction.guild.id, channel.id, `${type}.channel`);
            interaction.editReply({ content: `The \`${type}\` channel has been set to <#${channel.id}>` });
        } else if (action === "view") {
            interaction.editReply({ content: `The \`${type}\` channel is currently <#${client.settings.get(interaction.guild.id, `${type}.channel`)}>` });
        }
    },
    options: [
        {
            type: "String",
            name: "type",
            description: "The type of channel to set.",
            required: true,
            choices: { "General logs": "logs", "Moderator Logs": "modlogs", "Update Logs": "updates", "Prediction logs": "predictions" },
        },
        {
            type: "String",
            name: "action",
            description: "Add or remove a channel.",
            required: true,
            choices: { Set: "set", Remove: "remove", View: "view" },
        },
        { type: "Channel", name: "channel", description: "The channel which should be used.", required: true },
    ],
};
