module.exports = {
    name: "delete",
    description: "Delete a value in the database.",
    permission: 2,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        await interaction.deferReply({ ephemeral: false });
        const key = interaction.options.getString("key");
        const global = interaction.options.getBoolean("global");

        if (global) {
            if (!client.settings.has("global", key)) return interaction.editReply({ content: "This key does not exist globally." });
            client.settings.delete("global", key);
            interaction.editReply({ content: `The value for \`${key}\` has been deleted globally.` });
        } else {
            if (!client.settings.has(interaction.guild.id, key)) return interaction.editReply({ content: "This key does not exist in the current guild." });
            client.settings.delete(interaction.guild.id, key);
            interaction.editReply({ content: `The value for \`${key}\` has been deleted in this guild.` });
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
            description: "Whether or not the value to delete is guild specific.",
            required: false,
        },
    ],
};
