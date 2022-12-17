module.exports = {
    name: "add",
    description: "Adds the specified role to the reaction list.",
    permission: 1,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        const id = interaction.options.getRole("role").id;
        if (client.settings.get(interaction.guild.id, "roles").find((k) => k === id)) {
            interaction.editReply({ content: `<@&${id}> is already a reaction role` });
        } else {
            client.settings.push(interaction.guild.id, id, "roles");
            interaction.editReply({ content: `<@&${id}> has been added to the reaction list` });
        }
    },
    options: [{ type: "Role", name: "role", description: "The role to add to the reaction list.", required: true }],
};
