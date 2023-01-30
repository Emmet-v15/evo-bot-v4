module.exports = {
    name: "get",
    description: "Get permission level of a user.",
    permission: 2,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        await interaction.deferReply({ ephemeral: false });
        const user = interaction.options.getUser("user");
        if (user) {
            const id = user.id;
            // get permission for user from the database
            const permission = client.settings.get(interaction.guild.id, `permissions.${id}`);
            interaction.editReply({ content: `The permission for <@${id}> is \`${permission}\`` });
        }
    },
    options: [
        {
            type: "User",
            name: "user",
            description: "The user to set the permission for.",
            required: true,
        },
    ],
};
