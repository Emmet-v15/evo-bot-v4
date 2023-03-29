module.exports = {
    name: "roles",
    description: "Set roles for various different parts of the bot.",
    permission: 2,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        await interaction.deferReply({ ephemeral: true });

        const type = interaction.options.getString("type");
        const role = interaction.options.getRole("role");
        if (role) {
            const id = role.id;
            client.settings.set(interaction.guild.id, id, `role.${type}`);
            interaction.editReply({ content: `The \`${type}\` role has been set to <@&${id}>` });
        } else {
            interaction.editReply({
                content: `The \`${type}\` role is currently <@&${client.settings.get(interaction.guild.id, `role.${type}`)}>`,
            });
        }
    },
    options: [
        {
            type: "String",
            name: "type",
            description: "What will this role be bound to?",
            required: true,
            choices: {
                "Ticket Claiming": "ticketClaim",
                Support: "support",
                "Trial Support": "trialSupport",
                "Roblox Update": "updates",
                "Roblox Prediction": "predictions",
                "Evo Premium": "premium",
                "Evo Staff": "staff",
                "Evo Beta": "beta",
            },
        },
        { type: "Role", name: "role", description: "The role to assign a function." },
    ],
};
