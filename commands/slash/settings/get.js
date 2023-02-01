module.exports = {
    name: "get",
    description: "Read a value from the database.",
    permission: 2,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        await interaction.deferReply({ ephemeral: false });
        const key = interaction.options.getString("key");
        const global = interaction.options.getBoolean("global");

        if (global) {
            if (!client.settings.has("global", key)) return interaction.editReply({ content: "This key does not exist globally." });
            const value = client.settings.get("global", key);
            interaction.editReply({ content: `The value for \`${key}\` is \`${value}\` globally.` });
        } else {
            if (!client.settings.has(interaction.guild.id, key)) return interaction.editReply({ content: "This key does not exist in the current guild." });
            const value = client.settings.get(interaction.guild.id, key);
            interaction.editReply({ content: `The value for \`${key}\` is \`${value}\` in this guild.` });
        }
    },
    options: [
        {
            type: "String",
            name: "key",
            description: "The key to look for in the database.",
            required: true,
        },
        {
            type: "Boolean",
            name: "global",
            description: "Whether or not the value to get is guild specific.",
            required: false,
        },
    ],
};
