module.exports = {
    name: "users",
    description: "Placeholder command.",
    permission: 3,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        interaction.deferReply({ ephemeral: true });

        const action = interaction.options.getString("action");

        switch (action) {
            case "add": {
                const user = interaction.options.getUser("user");
                const type = interaction.options.getString("type");
                const amount = interaction.options.getInteger("amount");
            }
        }
    },
    options: [
        {
            type: "String",
            name: "action",
            description: "What action to perform.",
            required: true,
        },
        {
            type: "User",
            name: "user",
            description: "The user to perform the action on.",
            required: false,
        },
        {
            type: "String",
            name: "type",
            description: "The type of premium.",
            required: false,
            choices: { lifetime: "lifetime", month: "month", week: "week", day: "day", hour: "hour", beta: "beta" },
        },
    ],
};
