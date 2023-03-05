module.exports = {
    name: "premium",
    description: "Gives premium to the first X people that press a button.",
    permission: 3,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        interaction.editReply({ content: "Example response" });
    },
    options: [
        {
            type: "Integer",
            name: "number",
            description: "The number of people to give premium to.",
            required: true,
        },
    ],
};
