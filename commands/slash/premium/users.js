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

                if (!user) return interaction.editReply({ content: "You must provide a user." });
                if (!type) return interaction.editReply({ content: "You must provide the type of premium." });

                const premium = client.premium.get(user.id, "premium");
                break;
            }
            case "remove": {
                const user = interaction.options.getUser("user");

                if (!user) return interaction.editReply({ content: "You must provide a user." });

                const premium = client.premium.get(user.id, "premium");

                if (!premium) return interaction.editReply({ content: "This user does not have premium." });

                // remove premium role
                const guild = client.guilds.cache.get(interaction.guild);
                const member = guild.members.cache.get(user.id);
                const role = guild.roles.cache.get(client.settings.get(interaction.guild, "role.premium"));
                if (member.roles.cache.has(role.id)) member.roles.remove(role);
                client.userDB.delete(user.id, "premium");

                interaction.editReply({ content: "Successfully removed premium from this user." });
                break;
            }
            case "get": {
                const user = interaction.options.getUser("user");

                if (!user) return interaction.editReply({ content: "You must provide a user." });

                const premium = client.premium.get(user.id, "premium");

                if (!premium) return interaction.editReply({ content: "This user does not have premium." });

                interaction.editReply({ content: `This user has premium until <t:${premium}:R>` });
                break;
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
