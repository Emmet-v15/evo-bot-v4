module.exports = {
    name: "set",
    description: "Set permission level for a user.",
    permission: 2,
    execute: async (/** @type {require("discord.js").Client} */ client, /** @type {require("discord.js").CommandInteraction} */ interaction) => {
        await interaction.deferReply({ ephemeral: false });
        const user = interaction.options.getUser("user");
        const permission = interaction.options.getInteger("permission");
        if (user) {
            const id = user.id;
            // set permission for user to permission in the database

            // check if permission is valid
            if (permission < 0 || permission > 2) return interaction.editReply({ content: "Invalid permission level. [0-2]" });

            client.settings.set(interaction.guild.id, permission, `permissions.${id}`);

            interaction.editReply({ content: `The permission for <@${id}> has been set to \`${permission}\`` });
        }
    },
    options: [
        {
            type: "User",
            name: "user",
            description: "The user to set the permission for.",
            required: true,
        },
        {
            type: "Integer",
            name: "permission",
            description: "The permission level to set.",
            required: true,
        },
    ],
};
