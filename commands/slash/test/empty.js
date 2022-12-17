module.exports = {
    name: "empty",
    description: "Placeholder command",
    permission: 2,
    execute: async (client, interaction) => {
        interaction.editReply({ content: "Example response" });
    },
    options: [
        {
            type: "String",
            name: "options",
            description: "Example Options",
            required: false,
        },
    ],
};
