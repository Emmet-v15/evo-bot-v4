module.exports = {
    name: "set",
    description: "Set a value on the database.",
    permission: 2,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        await interaction.deferReply({ ephemeral: false });
        const key = interaction.options.getString("key");
        const value = interaction.options.getString("value");
        const global = interaction.options.getBoolean("global");

        if (global) {
            const oldValue = client.settings.get("global", key);
            client.settings.set("global", value, key);
            interaction.editReply({ content: `The value for \`${key}\` has been set ${oldValue ? `` : `from \`${oldValue}\``} to \`${value}\` globally.` });
        } else {
            const oldValue = client.settings.get(interaction.guild.id, key);
            client.settings.set(interaction.guild.id, value, key);
            interaction.editReply({
                content: `The value for \`${key}\` has been set ${oldValue ? `` : `from \`${oldValue}\``} to \`${value}\` in this guild.`,
            });
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
            type: "String",
            name: "value",
            description: "The value to set the key to.",
            required: true,
        },
        {
            type: "Boolean",
            name: "global",
            description: "Whether or not the value should be guild specific.",
            required: false,
        },
    ],
};
