module.exports = {
    name: "empty",
    description: "Placeholder command.",
    permission: 2,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").Interaction} */ interaction
    ) => {
        interaction.editReply({ content: "Example response" });
    },
    options: [
        {
            type: "String",
            name: "options",
            description: "Example Options.",
            required: false,
        },
    ],
};
