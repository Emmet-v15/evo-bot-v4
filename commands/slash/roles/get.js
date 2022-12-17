const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "get",
    description: "Gets every role on the reaction list.",
    permission: 1,
    execute: async (
        /** @type {require("discord.js").Client} */ client,
        /** @type {require("discord.js").CommandInteraction} */ interaction
    ) => {
        const roles = client.settings.get(interaction.guild.id, "roles");
        const array = [];
        for (var i = 0; i < roles.length; i++) {
            const id = roles[i];
            array.push({ name: `Role #${i + 1}:`, value: `<@&${id}> [${id}]`, inline: true });
        }
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Reaction Roles")
                    .setDescription(`Role Count: ${roles.length}`)
                    .addFields(array)
                    .setColor("Random")
                    .setTimestamp(),
            ],
        });
    },
};
