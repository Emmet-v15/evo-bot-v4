module.exports = {
    name: "remove",
    description: "Removes the specified role from the reaction list.",
    permission: 1,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        const id = interaction.options.getRole("role").id;
        if (client.settings.get(interaction.guild.id, "roles").find((k) => k === id)) {
            client.settings.remove(interaction.guild.id, id, "roles");
            interaction.editReply({ content: `<@&${id}> has been removed from the reaction list` });
        } else {
            interaction.editReply({ content: `<@&${id}> is not a reaction role` });
        }
    },
    options: [
        { type: "Role", name: "role", description: "The role to remove from the reaction list.", required: true },
    ],
};
