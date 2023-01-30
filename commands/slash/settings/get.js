module.exports = {
    name: "get",
    description: "Read a value from the database in the current guild.",
    permission: 2,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        await interaction.deferReply({ ephemeral: false });
        const key = interaction.options.getString("key");
        if (user) {
            console.log("abc");

            if (!client.settings.has(interaction.guild.id, key)) return interaction.editReply({ content: "This key does not exist in the current guild." });
            const value = client.settings.get(interaction.guild.id, key);
            interaction.editReply({ content: `The value for \`${key}\` is \`${value}\`` });
        }
    },
    options: [
        {
            type: "String",
            name: "key",
            description: "The key to look for in the database.",
            required: true,
        },
    ],
};
